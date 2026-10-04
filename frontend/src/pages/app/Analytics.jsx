import {
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { usePosts } from '../../data/usePosts'
import { STATUS } from '../../data/status'

const COLORS = {
  draft: '#94a3b8',
  needs_review: '#fbbf24',
  approved: '#34d399',
  scheduled: '#38bdf8',
  published: '#818cf8',
  rejected: '#fb7185',
  failed: '#f87171',
  regenerated: '#a78bfa',
}
const tooltipStyle = { background: '#0f172a', border: '1px solid #ffffff20', borderRadius: 8 }

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="font-semibold text-white">{title}</h2>
      <div className="mt-4 h-64">{children}</div>
    </div>
  )
}

export default function Analytics() {
  const { posts, loading, error } = usePosts()

  const count = (status) => posts.filter((p) => p.status === status).length
  const scored = posts.filter((p) => p.score !== null && p.score !== undefined)
  const avgScore = scored.length
    ? Math.round(scored.reduce((sum, p) => sum + p.score, 0) / scored.length)
    : null

  const stats = [
    { label: 'Posts generated', value: posts.length },
    { label: 'Approved', value: count('approved') },
    { label: 'Rejected', value: count('rejected') },
    { label: 'Regenerated', value: count('regenerated') },
    { label: 'Scheduled', value: count('scheduled') },
    { label: 'Published', value: count('published') },
    { label: 'Failed', value: count('failed') },
    { label: 'Avg AI score', value: avgScore ?? '-' },
  ]

  const overTime = Object.entries(
    posts.reduce((acc, p) => {
      acc[p.createdAt] = (acc[p.createdAt] || 0) + 1
      return acc
    }, {})
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({ date: date.slice(5), total }))

  const byStatus = Object.entries(STATUS)
    .map(([key, s]) => ({ name: s.label, value: count(key), color: COLORS[key] }))
    .filter((d) => d.value > 0)

  const byPlatform = ['Telegram'].map((name) => ({
    name,
    posts: posts.filter((p) => p.platform === name).length,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-slate-400">How your content pipeline is performing.</p>
      </div>

      {error && (
        <p className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-300">Could not load posts: {error}</p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>
      <p className="-mt-4 text-xs text-slate-500">
        AI score is an AI-generated estimate. Figures cover the posts created in this browser.
      </p>

      {!loading && posts.length === 0 && !error && (
        <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
          No data yet. Charts fill in once you create posts.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Posts created over time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={overTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="total" stroke="#818cf8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Status distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} label>
                {byStatus.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Platform distribution">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byPlatform}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="posts" fill="#d946ef" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}