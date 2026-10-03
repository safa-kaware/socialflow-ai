import { createClient } from '@supabase/supabase-js';

let client;

export function db() {
  if (!client) {
    const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) return null;
    client = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
      auth: { persistSession: false },
    });
  }
  return client;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (v) => UUID.test(String(v || ''));

export const sessionOf = (req) => {
  const id = String(req.headers['x-session-id'] || '');
  return UUID.test(id) ? id : null;
};