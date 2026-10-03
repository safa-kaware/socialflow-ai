import { useState } from 'react'
import { Search } from 'lucide-react'
import { posts } from '../../data/posts'
import { STATUS } from '../../data/status'
import StatusBadge from '../../components/app/StatusBadge'
import PostDetailsModal from '../../components/app/PostDetailsModal'

const inputCls =
  'rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400'

export default function History() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [platform, setPlatform] = useState('all')
  const [minScore, setMinScore] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = posts.filter((p) => {
    if (search && !p.topic.toLowerCase().includes(search.toLowerCase())) return false
    if (status !== 'all' && p.status !== status) return false
    if (platform !== 'all' && p.platform !== platform) return false
    if (minScore && (p.score === null || p.score < Number(minScore))) return false
    if (dateFrom && p.createdAt < dateFrom) return false
    return true
  })

  const reset = () => {
    setSearch('')
    setStatus('all')
    setPlatform('all')
    setMinScore('')
    setDateFrom('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">History</h1>
        <p className="text-sm text-slate-400">Every post you have created.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <input
            className={`${inputCls} pl-9`}
            placeholder="Search topics"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {Object.entries(STATUS).map(([key, s]) => (
            <option key={key} value={key}>{s.label}</option>
          ))}
        </select>

        <select className={inputCls} value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="all">All platforms</option>
          <option value="Telegram">Telegram</option>
          
        </select>

        <input
          className={`${inputCls} w-32`}
          type="number"
          min="0"
          max="100"
          placeholder="Min score"
          value={minScore}
          onChange={(e) => setMinScore(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm text-slate-400">
          From
          <input className={inputCls} type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </label>

        <button onClick={reset} className="text-sm text-slate-400 hover:text-white">
          Reset
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-slate-400">
  {posts.length === 0 ? 'No posts yet. Posts you create will appear here.' : 'No posts match these filters.'}
</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Topic</th>
                  <th className="pb-3 pr-4 font-medium">Platform</th>
                  <th className="pb-3 pr-4 font-medium">AI score</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t border-white/10">
                    <td className="py-3 pr-4 text-slate-400">{p.createdAt}</td>
                    <td className="py-3 pr-4 text-white">{p.topic}</td>
                    <td className="py-3 pr-4 text-slate-300">{p.platform}</td>
                    <td className="py-3 pr-4 text-slate-300">{p.score ?? '-'}</td>
                    <td className="py-3 pr-4"><StatusBadge status={p.status} /></td>
                    <td className="py-3">
                      <button onClick={() => setSelected(p)} className="text-indigo-300 hover:text-indigo-200">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PostDetailsModal post={selected} onClose={() => setSelected(null)} />
    </div>
  )
}