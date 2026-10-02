export default function TelegramPreview({ draft }) {
  const tags = (draft.hashtags || []).join(' ')

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-sky-500 text-sm font-bold text-white">S</div>
        <div>
          <p className="text-sm font-medium text-white">Your channel</p>
          <p className="text-xs text-slate-500">Telegram preview</p>
        </div>
      </div>

      <div className="mt-4 space-y-3 rounded-2xl rounded-tl-sm bg-slate-800 p-4 text-sm text-slate-200">
        {draft.title && <p className="font-semibold text-white">{draft.title}</p>}
        {draft.hook && <p>{draft.hook}</p>}
        <p className="whitespace-pre-wrap">{draft.content}</p>
        {draft.callToAction && <p>{draft.callToAction}</p>}
        {tags && <p className="text-sky-400">{tags}</p>}
      </div>
    </div>
  )
}