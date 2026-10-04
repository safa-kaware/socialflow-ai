import { timingSafeEqual } from 'node:crypto';
import { db, sessionOf, isUuid } from '../lib/db.js';

const fail = (res, status, error) => res.status(status).json({ ok: false, error });

const same = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'Method not allowed');
  }

  const { PUBLISH_PASSCODE } = process.env;
  const supabase = db();
  if (!PUBLISH_PASSCODE || !supabase) {
    return fail(res, 503, 'Scheduling is not enabled on this deployment');
  }

  const sid = sessionOf(req);
  if (!sid) return fail(res, 400, 'Missing session');

  const b = req.body || {};
  if (!same(b.passcode ?? '', PUBLISH_PASSCODE)) return fail(res, 401, 'Invalid passcode');
  if (!isUuid(b.postId)) return fail(res, 400, 'Invalid post id');

  const when = new Date(b.scheduledFor);
  if (Number.isNaN(when.getTime())) return fail(res, 400, 'Invalid date');

  const now = Date.now();
  if (when.getTime() < now + 2 * 60 * 1000) {
    return fail(res, 400, 'Choose a time at least 2 minutes in the future');
  }
  if (when.getTime() > now + 90 * 24 * 60 * 60 * 1000) {
    return fail(res, 400, 'Choose a date within the next 90 days');
  }

  const { data, error } = await supabase
    .from('posts')
    .update({
      status: 'scheduled',
      scheduled_for: when.toISOString(),
      error_message: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', b.postId)
    .eq('session_id', sid)
    .in('status', ['approved', 'failed', 'scheduled'])
    .select('id')
    .maybeSingle();

  if (error) return fail(res, 500, 'Could not schedule the post');
  if (!data) return fail(res, 409, 'Approve the post before scheduling it');

  return res.status(200).json({ ok: true, scheduledFor: when.toISOString() });
}