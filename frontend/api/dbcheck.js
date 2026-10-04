import { db } from '../lib/db.js';

const brief = (e) => (e ? { code: e.code, message: e.message } : 'ok');

export default async function handler(req, res) {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SECRET_KEY || '';

  const info = {
    hasUrl: Boolean(url),
    urlLooksRight: /^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url),
    hasKey: Boolean(key),
    keyType: key.startsWith('sb_secret_')
      ? 'secret (correct)'
      : key.startsWith('sb_publishable_')
        ? 'publishable (WRONG, use the secret key)'
        : key.startsWith('eyJ')
          ? 'legacy jwt'
          : key
            ? 'unrecognised'
            : 'missing',
  };

  const supabase = db();
  if (!supabase) return res.status(200).json({ ...info, connected: false });

  const read = await supabase.from('posts').select('id').limit(1);

  const write = await supabase
    .from('posts')
    .insert({
      session_id: 'healthcheck',
      topic: 'healthcheck',
      platform: 'Telegram',
      content_type: 'Educational',
      tone: 'Professional',
      target_audience: 'test',
      keywords: 'test',
      length: 'Short',
      title: 'test',
      hook: 'test',
      content: 'healthcheck',
      hashtags: ['#test'],
      call_to_action: 'test',
      ai_score: 1,
      review: { score: 1 },
      passed: false,
      attempts: 1,
      status: 'needs_review',
    })
    .select('id')
    .single();

  if (write.data?.id) await supabase.from('posts').delete().eq('id', write.data.id);

  return res.status(200).json({ ...info, connected: true, read: brief(read.error), write: brief(write.error) });
}