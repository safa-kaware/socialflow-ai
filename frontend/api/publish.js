import { timingSafeEqual } from 'node:crypto';
import { db, sessionOf, isUuid } from '../lib/db.js';

const fail = (res, status, error, extra = {}) =>
  res.status(status).json({ ok: false, error, ...extra });

const same = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

const text = (v, max) => String(v ?? '').trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'Method not allowed');
  }

  const { N8N_PUBLISH_URL, N8N_WEBHOOK_SECRET, PUBLISH_PASSCODE } = process.env;
  if (!N8N_PUBLISH_URL || !N8N_WEBHOOK_SECRET || !PUBLISH_PASSCODE) {
    return fail(res, 503, 'Live publishing is not enabled on this deployment');
  }

  const b = req.body || {};
  if (!same(b.passcode ?? '', PUBLISH_PASSCODE)) {
    return fail(res, 401, 'Invalid passcode');
  }

  const d = b.draft || {};
  const draft = {
    title: text(d.title, 200),
    hook: text(d.hook, 300),
    content: text(d.content, 3000),
    callToAction: text(d.callToAction, 300),
    hashtags: Array.isArray(d.hashtags)
      ? d.hashtags.slice(0, 10).map((h) => text(h, 40)).filter(Boolean)
      : [],
  };
  if (!draft.content) return fail(res, 400, 'There is no content to publish');

  const supabase = db();
  const sid = sessionOf(req);
  const postId = isUuid(b.postId) ? b.postId : null;
  const track = Boolean(supabase && sid && postId);

  const mark = async (patch) => {
    if (!track) return;
    await supabase
      .from('posts')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', postId)
      .eq('session_id', sid);
  };

  if (track) {
    const { data: row } = await supabase
      .from('posts')
      .select('status')
      .eq('id', postId)
      .eq('session_id', sid)
      .maybeSingle();
    if (!row) return fail(res, 404, 'Post not found');
    if (!['approved', 'failed'].includes(row.status)) {
      return fail(res, 409, 'Approve the post before publishing');
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);

  try {
    const r = await fetch(N8N_PUBLISH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-socialflow-secret': N8N_WEBHOOK_SECRET,
      },
      body: JSON.stringify({ draft }),
      signal: controller.signal,
    });

    const data = await r.json().catch(() => null);

    if (data && data.ok === true) {
      await mark({
        status: 'published',
        external_post_id: data.messageId == null ? null : String(data.messageId),
        error_message: null,
      });
      return res.status(200).json({
        ok: true,
        platform: data.platform || 'Telegram',
        messageId: data.messageId ?? null,
      });
    }

    const details = typeof data?.details === 'string' ? data.details.slice(0, 200) : undefined;
    await mark({ status: 'failed', error_message: details || 'Publishing failed' });
    return fail(res, 502, 'Publishing failed', details ? { details } : {});
  } catch (e) {
    const timedOut = e.name === 'AbortError';
    await mark({
      status: 'failed',
      error_message: timedOut ? 'Publishing took too long' : 'Could not reach the automation service',
    });
    return timedOut
      ? fail(res, 504, 'Publishing took too long')
      : fail(res, 502, 'Could not reach the automation service');
  } finally {
    clearTimeout(timer);
  }
}