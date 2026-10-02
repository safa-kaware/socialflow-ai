
export const config = { maxDuration: 60 };

const PLATFORMS = ['Telegram', 'Discord'];
const CONTENT_TYPES = ['Educational', 'Thought Leadership', 'Promotional', 'Announcement', 'Tips', 'Question', 'Story', 'Motivational'];
const TONES = ['Professional', 'Friendly', 'Inspirational', 'Technical', 'Conversational', 'Bold'];
const LENGTHS = ['Short', 'Medium', 'Long'];

const fail = (res, status, error) => res.status(status).json({ ok: false, error });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'Method not allowed');
  }

  const { N8N_GENERATE_URL, N8N_WEBHOOK_SECRET } = process.env;
  if (!N8N_GENERATE_URL || !N8N_WEBHOOK_SECRET) {
    return fail(res, 500, 'Server is not configured');
  }

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

    let data = null;
    try {
      data = await r.json();
    } catch {
      data = null;
    }

    if (data && data.ok === true) {
      return res.status(200).json({
        ok: true,
        draft: data.draft,
        review: data.review,
        passed: data.passed,
        attempts: data.attempts,
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