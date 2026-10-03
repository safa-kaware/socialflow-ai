import { db, sessionOf, isUuid } from '../lib/db.js';

export const config = { maxDuration: 60 };

const PLATFORMS = ['Telegram'];
const CONTENT_TYPES = ['Educational', 'Thought Leadership', 'Promotional', 'Announcement', 'Tips', 'Question', 'Story', 'Motivational'];
const TONES = ['Professional', 'Friendly', 'Inspirational', 'Technical', 'Conversational', 'Bold'];
const LENGTHS = ['Short', 'Medium', 'Long'];

const DAILY_CAP = 150;
const SESSION_CAP = 20;

const fail = (res, status, error) => res.status(status).json({ ok: false, error });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'Method not allowed');
  }

  const { N8N_GENERATE_URL, N8N_WEBHOOK_SECRET } = process.env;
  const supabase = db();
  if (!N8N_GENERATE_URL || !N8N_WEBHOOK_SECRET || !supabase) {
    return fail(res, 500, 'Server is not configured');
  }

  const sid = sessionOf(req) || 'anonymous';

  const b = req.body || {};
  const topic = String(b.topic || '').trim();
  if (!topic) return fail(res, 400, 'Topic is required');
  if (topic.length > 300) return fail(res, 400, 'Topic is too long (max 300 characters)');

  const pick = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback);

  const payload = {
    topic,
    platform: pick(b.platform, PLATFORMS, 'Telegram'),
    contentType: pick(b.contentType, CONTENT_TYPES, 'Educational'),
    tone: pick(b.tone, TONES, 'Professional'),
    length: pick(b.length, LENGTHS, 'Medium'),
    targetAudience: String(b.targetAudience || '').trim().slice(0, 150),
    keywords: String(b.keywords || '').trim().slice(0, 200),
  };

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [all, mine] = await Promise.all([
    supabase.from('posts').select('id', { count: 'exact', head: true }).gte('created_at', since),
    supabase.from('posts').select('id', { count: 'exact', head: true }).eq('session_id', sid).gte('created_at', since),
  ]);
  if (all.error || mine.error) return fail(res, 500, 'Database error');
  if ((all.count ?? 0) >= DAILY_CAP) {
    return fail(res, 429, 'The daily generation limit has been reached. Please try again tomorrow.');
  }
  if ((mine.count ?? 0) >= SESSION_CAP) {
    return fail(res, 429, 'You have reached the generation limit for today.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 55000);

  try {
    const r = await fetch(N8N_GENERATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-socialflow-secret': N8N_WEBHOOK_SECRET,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await r.json().catch(() => null);

    if (data && data.ok === true) {
      const d = data.draft || {};
      const { data: row, error } = await supabase
        .from('posts')
        .insert({
          session_id: sid,
          topic: payload.topic,
          platform: payload.platform,
          content_type: payload.contentType,
          tone: payload.tone,
          target_audience: payload.targetAudience,
          keywords: payload.keywords,
          length: payload.length,
          title: d.title,
          hook: d.hook,
          content: d.content,
          hashtags: Array.isArray(d.hashtags) ? d.hashtags : [],
          call_to_action: d.callToAction,
          ai_score: data.review?.score ?? null,
          review: data.review ?? null,
          passed: data.passed ?? null,
          attempts: data.attempts ?? null,
          status: 'needs_review',
        })
        .select('id')
        .single();

      if (isUuid(b.replaces) && sid !== 'anonymous') {
        await supabase
          .from('posts')
          .update({
            status: 'rejected',
            error_message: 'Replaced by a regenerated draft',
            updated_at: new Date().toISOString(),
          })
          .eq('id', b.replaces)
          .eq('session_id', sid)
          .in('status', ['needs_review', 'draft']);
      }

      return res.status(200).json({
        ok: true,
        draft: data.draft,
        review: data.review,
        passed: data.passed,
        attempts: data.attempts,
        postId: row?.id ?? null,
        saved: !error,
      });
    }

    if (data && data.ok === false && r.status === 400) {
      return fail(res, 400, data.error || 'Invalid request');
    }
    return fail(res, 502, 'The automation service failed to generate content');
  } catch (e) {
    if (e.name === 'AbortError') {
      return fail(res, 504, 'Generation took too long. Please try again.');
    }
    return fail(res, 502, 'Could not reach the automation service');
  } finally {
    clearTimeout(timer);
  }
}