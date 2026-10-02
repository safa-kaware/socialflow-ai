import { X } from 'lucide-react'
import StatusBadge from './StatusBadge'

export default function PostDetailsModal({ post, onClose }) {
  if (!post) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-semibold text-white">{post.topic}</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <StatusBadge status={post.status} />
          <span>{post.platform}</span>
          <span>·</span>
          <span>{post.createdAt}</span>
          <span>·</span>
          <span>AI score: {post.score ?? 'not reviewed'}</span>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm text-slate-200">{post.content}</p>
        <p className="mt-3 text-sm text-indigo-300">{post.hashtags.join(' ')}</p>
        <p className="mt-4 text-xs text-slate-500">Sample data</p>
      </div>
    </div>
  )
}