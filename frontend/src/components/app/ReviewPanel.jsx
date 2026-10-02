const bars = [
  ['Grammar', 'grammarScore'],
  ['Clarity', 'clarityScore'],
  ['Engagement', 'engagementScore'],
  ['Relevance', 'relevanceScore'],
]

export default function ReviewPanel({ review, passed, attempts }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white">AI review</h3>
          <p className="text-xs text-slate-500">
            AI-generated quality score: an estimate, not a guarantee.
          </p>
        </div>
        <p className="text-4xl font-bold text-white">{review.score}</p>
      </div>

      <p
        className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
          passed ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'
        }`}
      >
        {passed
          ? `Met the 80 threshold (${attempts} ${attempts === 1 ? 'draft' : 'drafts'} generated)`
          : `Below 80 after ${attempts} drafts. Please read it carefully.`}
      </p>

      <div className="mt-4 space-y-3">
        {bars.map(([label, key]) => (
          <div key={key}>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{label}</span>
              <span>{review[key]}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-white/10">
              <div className="h-1.5 rounded-full bg-indigo-400" style={{ width: `${review[key]}%` }} />
            </div>
          </div>
        ))}
      </div>

      {review.issues.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-medium text-white">Issues</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
            {review.issues.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}

      {review.suggestions.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-medium text-white">Suggestions</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
            {review.suggestions.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}