export const STATUS = {
  draft: { label: 'Draft', cls: 'bg-slate-500/15 text-slate-300' },
  needs_review: { label: 'Needs review', cls: 'bg-amber-500/15 text-amber-300' },
  approved: { label: 'Approved', cls: 'bg-emerald-500/15 text-emerald-300' },
  scheduled: { label: 'Scheduled', cls: 'bg-sky-500/15 text-sky-300' },
  published: { label: 'Published', cls: 'bg-indigo-500/15 text-indigo-300' },
  rejected: { label: 'Rejected', cls: 'bg-rose-500/15 text-rose-300' },
  failed: { label: 'Failed', cls: 'bg-red-500/15 text-red-300' },
}

export const posts = [
  { id: 1, topic: 'How generative AI is changing software development', platform: 'Telegram', status: 'published', score: 91, createdAt: '2026-09-28' },
  { id: 2, topic: 'Five habits of productive student developers', platform: 'Discord', status: 'scheduled', score: 87, createdAt: '2026-09-29' },
  { id: 3, topic: 'Why version control matters from day one', platform: 'Telegram', status: 'approved', score: 84, createdAt: '2026-09-29' },
  { id: 4, topic: 'Automating repetitive tasks with n8n', platform: 'Discord', status: 'needs_review', score: 78, createdAt: '2026-09-30' },
  { id: 5, topic: 'Prompt design basics for beginners', platform: 'Telegram', status: 'draft', score: null, createdAt: '2026-09-30' },
  { id: 6, topic: 'Is your portfolio telling the right story?', platform: 'Discord', status: 'rejected', score: 62, createdAt: '2026-10-01' },
  { id: 7, topic: 'What a REST API actually is', platform: 'Telegram', status: 'failed', score: 88, createdAt: '2026-10-01' },
  { id: 8, topic: 'Learning in public: a student guide', platform: 'Telegram', status: 'published', score: 93, createdAt: '2026-10-01' },
]

export const weeklyActivity = [
  { day: 'Mon', generated: 3, published: 1 },
  { day: 'Tue', generated: 5, published: 2 },
  { day: 'Wed', generated: 2, published: 2 },
  { day: 'Thu', generated: 4, published: 1 },
  { day: 'Fri', generated: 6, published: 3 },
  { day: 'Sat', generated: 1, published: 0 },
  { day: 'Sun', generated: 2, published: 1 },
]