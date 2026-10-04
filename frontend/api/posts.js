import { db, sessionOf, isUuid } from '../lib/db.js';

const fail = (res, status, error) => res.status(status).json({ ok: false, error });
const text = (v, max) => String(v ?? '').trim().slice(0, max);

const COLUMNS =
  'id, topic, platform, tone, content_type, title, hook, content, hashtags, call_to_action, ai_score, review, passed, attempts, status, external_post_id, error_message, scheduled_for, created_at';

export default async function handler(req, res) {
  const supabase = db();
  if (!supabase) return fail(res, 500, 'Server is not configured');

  const sid = sessionOf(req);
  if (!sid) return fail(res, 400, 'Missing session');

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('posts')
      .select(COLUMNS)
      .eq('session_id', sid)
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) {
      console.error('posts list failed', error);
      return fail(res, 500, 'Could not load posts');
    }
    return res.status(200).json({ ok: true, posts: data });
  }

  if (req.method === 'POST') {
    const b = req.body || {};
    if (!isUuid(b.id)) return fail(res, 400, 'Invalid post id');

    let patch;
    if (b.action === 'approve') patch = { status: 'approved' };
    else if (b.action === 'unapprove') patch = { status: 'needs_review' };
    else if (b.action === 'reject') patch = { status: 'rejected' };
    else if (b.action === 'unschedule') patch = { status: 'approved', scheduled_for: null };
    else if (b.action === 'edit') {
      const d = b.draft || {};
      const content = text(d.content, 3000);
      if (!content) return fail(res, 400, 'Content cannot be empty');
      patch = {
        title: text(d.title, 200),
        hook: text(d.hook, 300),
        content,
        call_to_action: text(d.callToAction, 300),
        hashtags: Array.isArray(d.hashtags)
          ? d.hashtags.slice(0, 10).map((h) => text(h, 40)).filter(Boolean)
          : [],
      };
    } else {
      return fail(res, 400, 'Unknown action');
    }

    let query = supabase
      .from('posts')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', b.id)
      .eq('session_id', sid);

    query =
      b.action === 'unschedule'
        ? query.eq('status', 'scheduled')
        : query.not('status', 'in', '(published,scheduled)');

    const { data, error } = await query.select('id').maybeSingle();

    if (error) return fail(res, 500, 'Could not update the post');
    if (!data) return fail(res, 404, 'Post not found, or it is already scheduled or published');
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, POST');
  return fail(res, 405, 'Method not allowed');
}