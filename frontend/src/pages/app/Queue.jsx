import { useState } from 'react'
import { usePosts } from '../../data/usePosts'
import { STATUS } from '../../data/status'
import StatusBadge from '../../components/app/StatusBadge'
import PostDetailsModal from '../../components/app/PostDetailsModal'

export default function Queue() {
  const { posts, loading, error } = usePosts()
  const [selected, setSelected] = useState(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Queue</h1>
        <p className="text-sm text-slate-400">Posts grouped by where they are in the pipeline.</p>
      </div>

      {error && (
        <p className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-300">Could not load posts: {error}</p>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.keys(STATUS).map((key) => {
          const items = posts.filter((p) => p.status === key)
          return (
            <div key={key} className="w-72 shrink-0 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <StatusBadge status={key} />
                <span className="text-sm text-slate-500">{items.length}</span>
              </div>

              <div className="mt-4 space-y-3">
                {items.length === 0 && (
                  <p className="text-sm text-slate-500">{loading ? 'Loading...' : 'Nothing here.'}</p>
                )}
                {items.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-left transition hover:border-indigo-400/40"
                  >
                    <p className="text-sm text-white">{p.topic}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {p.platform}
                      {p.score !== null && p.score !== undefined && ` · AI score ${p.score}`}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <PostDetailsModal post={selected} onClose={() => setSelected(null)} />
    </div>
  )
}