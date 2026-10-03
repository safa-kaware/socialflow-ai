import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { posts } from '../../data/posts'
import StatusBadge from '../../components/app/StatusBadge'

const count = (status) => posts.filter((p) => p.status === status).length
const scored = posts.filter((p) => p.score !== null)
const avgScore = scored.length
  ? Math.round(scored.reduce((sum, p) => sum + p.score, 0) / scored.length)
  : null

const dayKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (6 - i))
  return {
    day: d.toLocaleDateString('en-US', { weekday: 'short' }),
    generated: posts.filter((p) => p.createdAt === dayKey(d)).length,
  }
})

const stats = [
  { label: 'Total posts', value: posts.length },
  { label: 'Drafts', value: count('draft') },
  { label: 'Pending approval', value: count('needs_review') },
  { label: 'Approved', value: count('approved') },
  { label: 'Scheduled', value: count('scheduled') },
  { label: 'Published', value: count('published') },
  { label: 'Avg AI score', value: avgScore ?? '-' },
]

export default function Dashboard() {
  const recent = [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400">An overview of your content pipeline.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{s.value}</p>
            {s.label === 'Avg AI score' && (
              <p className="mt-1 text-xs text-slate-500">AI-generated estimate</p>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="font-semibold text-white">Posts created in the last 7 days</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #ffffff20', borderRadius: 8 }} />
              <Bar dataKey="generated" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="font-semibold text-white">Recent posts</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3 pr-4 font-medium">Topic</th>
                <th className="pb-3 pr-4 font-medium">Platform</th>
                <th className="pb-3 pr-4 font-medium">AI score</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((p) => (
                <tr key={p.id} className="border-t border-white/10">
                  <td className="py-3 pr-4 text-white">{p.topic}</td>
                  <td className="py-3 pr-4 text-slate-300">{p.platform}</td>
                  <td className="py-3 pr-4 text-slate-300">{p.score ?? '-'}</td>
                  <td className="py-3"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {recent.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-400">
              No posts yet. Posts you create will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}