# SocialFlow AI

**AI-powered social media content automation, from idea to publication.**

SocialFlow AI is a full-stack web application that drafts a social media post with AI, reviews its own draft, lets a human approve or edit it, and publishes it to Telegram through an n8n workflow. It was built as a college project (*Project 4: AI Social Media Automation using n8n*) and extended into a deployed portfolio project.

- **Live demo:** https://socialflow-ai-delta.vercel.app
- **Source:** https://github.com/YOUR_USERNAME/socialflow-ai

> Visitors can generate, review, edit and approve posts. Publishing to the live Telegram channel needs an owner passcode, so a public visitor cannot post to it.

## Contents

1. [What it does](#what-it-does)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Tech stack](#tech-stack)
5. [Repository structure](#repository-structure)
6. [Setup guide](#setup-guide) (secrets, Supabase, Groq, **Telegram**, n8n, Vercel)
7. [How to use the website](#how-to-use-the-website)
8. [n8n workflows](#n8n-workflows)
9. [Groq integration](#groq-integration)
10. [Database](#database)
11. [API](#api)
12. [Environment variables](#environment-variables)
13. [Security](#security)
14. [Testing](#testing)
15. [Troubleshooting](#troubleshooting)
16. [Limitations](#limitations)
17. [Future scope](#future-scope)

---

## What it does

1. **Create.** The user enters a topic, content type, tone, audience, keywords and length.
2. **AI generates.** An n8n workflow sends a prompt template to Groq and validates the JSON it returns (title, hook, content, hashtags, call to action).
3. **AI reviews.** A second Groq call scores the draft for grammar, clarity, engagement and relevance, and lists issues and suggestions.
4. **Automatic retry.** If the score is below 80, the workflow regenerates the draft using the reviewer's feedback, at most 2 times. It cannot loop forever.
5. **Human approval.** The user can approve, edit, regenerate (maximum 2 times) or reject. The AI never publishes by itself.
6. **Publish.** An approved post is sent to a Telegram channel through a second n8n workflow. Success is reported only after Telegram confirms the message. A failure is shown with its reason and saved as `failed`.
7. **History.** Every draft, review and status is stored in Supabase and shown on the Dashboard, Queue, History and Analytics pages.

The AI quality score is labelled in the interface as an **AI-generated estimate**. It is not an objective measurement.

## Features

**Built and working**

- AI generation and AI review with Groq, using structured JSON and server-side validation
- Retry loop with a hard cap of 2 regenerations
- Approve, edit, regenerate and reject, with every status change saved
- Real publishing to Telegram, with honest success and failure reporting
- Dashboard, Queue (by status), History (search and filters) and Analytics, all driven by real saved data
- Owner passcode for publishing, asked once per browser session
- Daily usage caps on generation, to protect the AI quota
- Input validation in the browser, the API and the n8n workflow
- No secrets in the browser: every key lives in server-side environment variables or n8n credentials
- A script that generates the secrets needed for setup

**Not built** (see [Limitations](#limitations) and [Future scope](#future-scope))

- Scheduled publishing (the calendar and scheduling endpoint exist but are switched off, because the n8n workflow that sends due posts is not built)
- Platforms other than Telegram
- User accounts and login
- Visitors connecting their own Telegram channel
- A dedicated central error-handling workflow

## Architecture

```text
                      Browser (React + Vite, hosted on Vercel)
                                       |
                    /api/generate  /api/posts  /api/publish
                                       |
                      Vercel serverless functions (hold the secrets)
                          |                              |
                          v                              v
                   n8n Cloud webhooks               Supabase (PostgreSQL)
                    |             |                    posts table
                    v             v
                  Groq        Telegram Bot API
          (generate + review)    (publish)
```



## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS v4, React Router, Recharts, Lucide icons |
| Backend | Vercel serverless functions (Node.js) in `frontend/api` |
| Automation | n8n Cloud |
| AI | Groq API (OpenAI-compatible chat completions) |
| Database | Supabase PostgreSQL |
| Publishing | Telegram Bot API |
| Hosting and source | Vercel, GitHub |

## Repository structure

```text
.
├── frontend/
│   ├── api/                    Serverless functions (the backend)
│   │   ├── generate.js         Validates input, calls n8n, saves the draft
│   │   ├── posts.js            Lists posts and updates their status
│   │   ├── publish.js          Passcode-protected publishing through n8n
│   │   └── schedule.js         Scheduling endpoint (disabled)
│   ├── lib/db.js               Supabase client helper (server side only)
│   ├── src/                    React application
│   └── vercel.json             Single-page-app rewrite
├── n8n/
│   └── workflows/              Exported n8n workflows (no credentials)
├── database/schema.sql         Database schema
├── scripts/generate-secrets.mjs  Generates the webhook secret and publish passcode
├── backend/README.md           Explains that the backend lives in frontend/api
├── .env.example                Names of the required environment variables
└── README.md
```

---

## Setup guide

Follow these steps in order. You need accounts for GitHub, Vercel, Supabase, Groq, n8n and Telegram. Each service has a free tier or trial at the time of writing; check current terms yourself, because they change.

### Step 0: Get the code

```bash
git clone https://github.com/YOUR_USERNAME/socialflow-ai.git
cd socialflow-ai
```

### Step 1: Generate your secrets

The project needs two secrets you make up yourself. A script creates strong random values (Node.js 18 or newer):

```bash
node scripts/generate-secrets.mjs
```

It prints:

- **`N8N_WEBHOOK_SECRET`**: a long random string. The website's functions send it to n8n, and n8n rejects any request without it. It goes in **two places** with exactly the same value: Vercel and the n8n credential (Step 5).
- **`PUBLISH_PASSCODE`**: a passcode like `K7QM-2XH9-PD4R-W3NC`. You type it on the website once per browser session to publish. It goes in **one place**: Vercel.

The script prints the values once and saves nothing, so they cannot be committed by accident. Store them in a password manager. To rotate them later, run the script again and update Vercel and n8n.

### Step 2: Supabase (database)

1. Create a project at supabase.com. Choose a region near you and save the database password somewhere safe. You will not need it for this project.
2. Open **SQL Editor**, paste the contents of `database/schema.sql`, and run it. In **Table Editor** you should now see an empty `posts` table.
3. Open **Project Settings, API Keys** and note two values:
   - **Project URL**: like `https://abcdefghijklmnop.supabase.co`. Use only this base address. Do not add `/rest/v1/` or a trailing slash.
   - **Secret key**: starts with `sb_secret_`. Use the copy button, because the displayed text is masked.

Do not use the **publishable** key (`sb_publishable_...`). The table is locked by Row Level Security, so that key cannot read or write it. The secret key is for server code only and must never go into the frontend or the repository.

### Step 3: Groq (AI)

1. Sign in at console.groq.com, open **API Keys**, and create a key. Copy it once and keep it private.
2. Check which models your account can use: open `https://api.groq.com/openai/v1/models` with your key, or look at Groq's model list in the console. The workflows use `openai/gpt-oss-120b`. If that model is not available to you, pick another general chat model and change the model name in the two Groq nodes in Step 5.

### Step 4: Telegram (publishing)

SocialFlow AI publishes through a **Telegram bot** that posts into a **channel**. You set this up once, as the owner.

**4a. Create the bot**

1. In Telegram, search for **@BotFather** and open it.
2. Send `/newbot`.
3. Enter a display name, then a username that ends in `bot` (for example `my_socialflow_bot`).
4. BotFather replies with a **token** that looks like `123456789:AAH...`. Keep it private. If it ever leaks, send BotFather `/revoke` to get a new one.

**4b. Create the channel**

1. In Telegram, create a new **Channel**.
2. When asked for the type, choose **Public** and set a username, for example `socialflow_demo`. The channel's link is then `t.me/socialflow_demo`.
3. The channel's identifier for this project is **`@` plus the part after `t.me/`**, so `@socialflow_demo`.

> The channel's display name (the title you typed) is **not** its username. If the two differ, use the one from the `t.me/...` link. Using the display name is the most common cause of the error `chat not found`.

**4c. Add the bot as an administrator**

1. Open the channel, then **Administrators**, then **Add Administrator**.
2. Search for your bot's username and select it.
3. Allow **Post Messages**. Other permissions are not needed.

A bot that is not an administrator cannot post, and Telegram answers `Forbidden`.

**4d. Optional: use a private channel**

A private channel has no username, so it needs its numeric ID instead:

1. Add the bot as an administrator (4c) and post any message in the channel.
2. Open `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` in a browser, replacing `<YOUR_TOKEN>` with your bot token. Do this on your own device and do not share the page.
3. Find `"chat":{"id":-100...}` in the result. That number, including the minus sign, is the Chat ID. If the result is empty, post another message in the channel and reload.

Use that number instead of `@username` as the Chat ID in Step 5.

**4e. What you now have**

- the **bot token** (goes into an n8n credential)
- the **channel username** (`@...`) or numeric ID (goes into the n8n Telegram node)

Telegram messages are limited to about 4096 characters. The publish workflow trims posts to 4000.

### Step 5: n8n (automation)

1. In n8n, import both workflows from `n8n/workflows/`: open a new workflow, use the menu (three dots), choose **Import from file**, and select `generate-and-review.json`. Repeat for `publish-telegram.json`.
2. Create three credentials (**Credentials, Create credential**):

   | Credential name | Type | Fields |
   |---|---|---|
   | `Groq API` | Header Auth | Name `Authorization`, Value `Bearer ` followed by your Groq key (one space after `Bearer`) |
   | `SocialFlow secret` | Header Auth | Name `x-socialflow-secret`, Value your `N8N_WEBHOOK_SECRET` from Step 1 |
   | `Telegram account` | Telegram API | Access Token: your bot token |

   In a Header Auth credential, **Name** is the HTTP header name and must be exactly as shown. A label with spaces there produces the error `Header name must be a valid HTTP token`.
3. Open each imported workflow and re-select the credentials on the nodes that use them (imports sometimes drop the link):
   - both **Webhook** nodes: `SocialFlow secret`
   - the two **Groq** HTTP nodes: `Groq API`
   - the **Send to Telegram** node: `Telegram account`
4. In `Send to Telegram`, set **Chat ID** to your channel (`@socialflow_demo`, or the numeric ID).
5. Check the model name in the two Groq nodes (Step 3).
6. **Publish** both workflows. Then open each Webhook node, switch to the **Production URL** tab and copy the URL:
   - `.../webhook/socialflow-generate`
   - `.../webhook/socialflow-publish`

   The Test URL (`/webhook-test/...`) only works once after clicking Execute workflow, so do not use it.

### Step 6: Vercel (hosting)

1. Import the GitHub repository in Vercel. Set **Root Directory** to `frontend`. The framework should be detected as Vite.
2. Under **Settings, Environment Variables**, add these (tick Production, and Preview if you use previews):

   | Name | Value |
   |---|---|
   | `N8N_GENERATE_URL` | the generate Production URL from Step 5 |
   | `N8N_PUBLISH_URL` | the publish Production URL from Step 5 |
   | `N8N_WEBHOOK_SECRET` | from Step 1 |
   | `PUBLISH_PASSCODE` | from Step 1 |
   | `SUPABASE_URL` | the Project URL from Step 2 |
   | `SUPABASE_SECRET_KEY` | the secret key from Step 2 |

   Never prefix these names with `VITE_`: such variables are bundled into the public website.
3. **Deploy**. Environment variables only apply to new deployments, so after adding or editing any of them, open **Deployments**, use the menu on the latest one, and choose **Redeploy**.

### Step 7: Check that everything is connected

1. Open your site and go to **Create**. Generate a post. A draft with an AI review should appear within about 40 seconds.
2. Open **History**. The post should be listed with status **Needs review**. This confirms the database works.
3. Click **Approve**, enter your passcode, and click **Publish now**. The post should appear in your Telegram channel, and its status in History should change to **Published**.

If a step fails, see [Troubleshooting](#troubleshooting).

### Run the frontend locally

```bash
cd frontend
npm install
npm run dev
```

By default, `vite.config.js` proxies `/api` requests to the deployed site, so the local frontend uses the deployed functions and their environment variables. To run the functions locally as well, use the Vercel CLI (`vercel dev`) with the same variables.

```bash
npm run lint    # ESLint
npm run build   # production build
```

Run `npm` commands inside `frontend`, not in the repository root.

---

## How to use the website

**Open the site** and choose **Try it** to enter the application. The sidebar has these pages: Dashboard, Create, Queue, Calendar, History, Analytics, Automation and Settings.

### Creating a post

1. Go to **Create**.
2. Fill in the form:
   - **Topic** (required, up to 300 characters): what the post is about
   - **Platform**: Telegram
   - **Length**: Short, Medium or Long
   - **Content type**: for example Educational, Tips or Announcement
   - **Tone**: for example Professional, Friendly or Bold
   - **Target audience** and **Keywords** (optional, they steer the writing)
3. Click **Generate content**. It runs two AI calls (write, then review) and can take up to about 40 seconds.

### Reading the result

- The **preview** shows the post as it would look in Telegram: title, hook, body, call to action and hashtags.
- The **AI review** shows an overall score, four sub-scores, a list of issues and a list of suggestions. These scores are an AI-generated estimate. They help you decide, but they do not replace reading the post yourself.
- If the first draft scored below 80, the system already regenerated it automatically (up to 2 times). The review panel states how many drafts were generated and whether the final one reached 80.

### Deciding what to do

| Button | What it does |
|---|---|
| **Approve** | Marks the post approved and saves that. Nothing is published yet. |
| **Edit** | Lets you change the title, hook, content, call to action and hashtags. If you edit, the page reminds you that the AI score refers to the original draft. |
| **Regenerate** | Asks the AI for a new draft with the same settings. You can do this up to 2 times per post. The replaced draft is kept in History as *Regenerated*. |
| **Reject** | Discards the draft. It is saved as *Rejected*. |

### Publishing (owner only)

After you approve a post, the **Approved** panel appears.

1. Enter the **owner passcode** (the `PUBLISH_PASSCODE` set in Vercel). You are asked only once per browser session. Closing the tab, or choosing **Lock again**, makes it ask again.
2. Click **Publish now**.
3. If Telegram accepts the post, a green **Published to Telegram** card appears, with the message ID. If something fails, a red message shows the reason, and the post is saved as *Failed*. The app never reports success unless Telegram confirmed it.

Visitors without the passcode can do everything above except publish.

### Other pages

- **Dashboard**: totals by status, the average AI score and the last 7 days of activity.
- **Queue**: posts grouped by status (Draft, Needs review, Approved, Scheduled, Published, Rejected, Failed, Regenerated). Click a card for details.
- **History**: every post, with search, status, platform, minimum score and date filters. Click **View** for the full post and, for failed posts, the error.
- **Analytics**: counts and charts for posts over time, status distribution and platform distribution.
- **Calendar**: reserved for scheduled posts. Scheduling is switched off in this version.
- **Automation**: shows which workflows are built, and where each step of the pipeline runs.
- **Settings**: read-only view of the platform connection and pipeline rules.


---

### 1. Generate and review (`generate-and-review.json`)

```text
Webhook -> Validate input -> IF valid -> Build prompt -> Groq generate -> Parse draft
        -> Groq review -> Parse review -> IF done -> Respond success
                                              |
                                              +-- (score < 80 and attempts left) -> Prepare retry -> Build prompt
```

- The webhook requires the secret header `x-socialflow-secret`.
- Invalid input returns a `400` with a message, before any AI call.
- Both Groq nodes retry once on failure.
- `Parse draft` and `Parse review` reject malformed JSON and clamp scores to 0 to 100.
- Whether a draft "passed" is decided by the workflow from the score, never by the model.
- The retry counter uses n8n's own run index, so the cap of 2 regenerations cannot be bypassed.

### 2. Publish to Telegram (`publish-telegram.json`)

```text
Webhook -> Prepare message -> Send to Telegram -- success --> Respond published
                                              \-- error ---> Respond failed (HTTP 502)
```

The workflow replies `ok: true` only after Telegram has accepted the message.

## Groq integration

The prompt template is built in the `Build prompt` node from these variables: `topic`, `platform`, `contentType`, `tone`, `targetAudience`, `length`, `keywords`.

On a retry, the reviewer's issues and suggestions are appended to the prompt.

- **Model:** `openai/gpt-oss-120b`, chosen from the models available to the project's Groq account. Model availability changes, so check your own list and update the name in the two Groq nodes if needed.
- **Settings:** temperature 0.7 for writing and 0.2 for reviewing, with JSON response format.
- **Review output:** `score`, `grammarScore`, `clarityScore`, `engagementScore`, `relevanceScore`, `issues`, `suggestions`.

## Database

One table, `posts`, defined in [`database/schema.sql`](database/schema.sql). It stores the draft, its review (as JSON), the AI score, the status, the Telegram message ID and any error message.

Statuses: `draft`, `needs_review`, `approved`, `scheduled`, `published`, `rejected`, `failed`. Drafts replaced by a regeneration are stored as `rejected` with a note, and the interface shows them as *Regenerated*.

Row Level Security is enabled with **no policies**, so the public browser key cannot read or write the table. Only the serverless functions, using the Supabase secret key, can access it.

> The original design planned five tables (users, posts, reviews, schedules, executions). For a first working version, the review is stored as JSON inside `posts` and there is no separate users table. See [Future scope](#future-scope).

## API

All endpoints are served from the same domain as the website. Requests from the browser send a random per-browser identifier in the `x-session-id` header.

### `POST /api/generate`

Body: `topic` (required, up to 300 characters), `platform` (`Telegram`), `contentType`, `tone`, `length`, `targetAudience`, `keywords`, and optionally `replaces` (the ID of a draft being regenerated).

Success (`200`):

```json
{
  "ok": true,
  "draft": { "title": "", "hook": "", "content": "", "hashtags": [], "callToAction": "" },
  "review": {
    "score": 90, "grammarScore": 95, "clarityScore": 90, "engagementScore": 80,
    "relevanceScore": 95, "issues": [], "suggestions": []
  },
  "passed": true,
  "attempts": 1,
  "postId": "uuid",
  "saved": true
}
```

Errors: `400` invalid input, `429` usage limit reached, `502` or `504` automation service failed or timed out, `500` server not configured.

A quick smoke test (this saves one post under an anonymous session):

```bash
curl -X POST https://YOUR-SITE.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"Why version control matters from day one","tone":"Friendly"}'
```

### `GET /api/posts`

Returns the posts belonging to the caller's session, newest first (up to 200).

### `POST /api/posts`

Body: `{ "id": "uuid", "action": "approve | unapprove | reject | edit | unschedule", "draft": { ... } }`. `draft` is required only for `edit`. Published posts cannot be changed.

### `POST /api/publish`

Body: `{ "passcode": "...", "postId": "uuid", "draft": { ... } }`. Requires the owner passcode and an approved post.

Success: `{ "ok": true, "platform": "Telegram", "messageId": 123 }`.
Errors: `401` invalid passcode, `409` post not approved, `502` publishing failed (with the reason in `details`), `503` publishing not enabled.

### `POST /api/schedule`

Currently returns `503 Scheduling is not enabled yet`.

## Environment variables

All of these are **server-side** variables, set in Vercel. None may start with `VITE_`. `.env.example` lists the names only.

| Variable | Purpose |
|---|---|
| `N8N_GENERATE_URL` | Production URL of the generate-and-review webhook |
| `N8N_PUBLISH_URL` | Production URL of the publish webhook |
| `N8N_WEBHOOK_SECRET` | Shared secret sent as `x-socialflow-secret` |
| `PUBLISH_PASSCODE` | Owner passcode required to publish |
| `SUPABASE_URL` | Supabase project URL, with no trailing path |
| `SUPABASE_SECRET_KEY` | Supabase secret key (`sb_secret_...`) |
| `SCHEDULING_ENABLED` | Leave unset; scheduling stays off |

Credentials for Groq and Telegram live inside n8n, not in this project.

## Security

- API keys and secrets are never sent to the browser.
- The n8n webhooks reject requests without the shared secret header.
- The Supabase table is locked by Row Level Security. Only server-side code can use it.
- Publishing requires an owner passcode, checked on the server with a constant-time comparison. The passcode is kept in the browser's session storage for the current tab session only.
- Every API endpoint validates and trims its input, and restricts platform, tone, content type and length to known values.
- Generation is capped per day, both globally and per browser session, so the public demo cannot exhaust the AI quota.
- Exported n8n workflows contain no credentials.
- `scripts/generate-secrets.mjs` prints secrets to the terminal only. It never writes them to disk.

## Testing

Manual test results. Replace `TODO` with `Passed` or `Failed` after running each one.

| # | Area | Test | Result |
|---|---|---|---|
| 1 | Generation | Valid topic returns a draft and a review | Passed |
| 2 | Generation | Empty topic is rejected before any AI call | TODO |
| 3 | Generation | Topic longer than 300 characters is rejected | TODO |
| 4 | Generation | Special characters and quotes in the topic | TODO |
| 5 | Review | Score of 80 or more returns without a retry | Passed |
| 6 | Review | Score below 80 triggers a retry and stops after 2 | Passed |
| 7 | Review | Malformed JSON from the model is caught with a clear error | TODO |
| 8 | Approval | Approve, edit and reject are saved and visible in History | TODO |
| 9 | Approval | Manual regeneration is limited to 2 | TODO |
| 10 | Publishing | An approved post appears in the Telegram channel | Passed |
| 11 | Publishing | A wrong passcode is rejected and nothing is published | Passed |
| 12 | Publishing | A Telegram failure is shown and the post is saved as failed | TODO |
| 13 | Security | Webhook rejects a missing or wrong secret | Passed |
| 14 | Data | Posts appear on the Dashboard | Passed |
| 15 | UI | Layout on desktop, tablet and phone | TODO |


