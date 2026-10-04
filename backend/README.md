# Backend

The backend runs as Vercel serverless functions inside the frontend project,
so the whole app deploys together:

- `frontend/api/generate.js`: validates input, calls the n8n generate workflow, saves the draft
- `frontend/api/posts.js`: lists and updates saved posts
- `frontend/api/publish.js`: passcode-protected publishing through the n8n Telegram workflow
- `frontend/lib/db.js`: Supabase client helper (server-side only)

Secrets (n8n URLs, webhook secret, publish passcode, Supabase secret key) live only in
Vercel environment variables.