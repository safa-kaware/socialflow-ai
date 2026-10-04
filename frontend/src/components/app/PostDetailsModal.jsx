import { X } from 'lucide-react'
import StatusBadge from './StatusBadge'

export default function PostDetailsModal({ post, onClose, children }) {
  if (!post) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-6"
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

        {post.title && <p className="mt-4 font-medium text-white">{post.title}</p>}
        {post.hook && <p className="mt-2 text-sm text-slate-200">{post.hook}</p>}
        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">{post.content}</p>
        {post.callToAction && <p className="mt-2 text-sm text-slate-200">{post.callToAction}</p>}
        {post.hashtags.length > 0 && (
          <p className="mt-3 text-sm text-indigo-300">{post.hashtags.join(' ')}</p>
        )}

        {post.status === 'failed' && post.errorMessage && (
          <p className="mt-4 rounded-lg bg-rose-500/10 p-3 text-xs text-rose-300">
            Publishing error: {post.errorMessage}
          </p>
        )}
        {post.status === 'published' && post.externalId && (
          <p className="mt-4 text-xs text-slate-500">Telegram message ID: {post.externalId}</p>
        )}

        {children}
      </div>
    </div>
  )
}