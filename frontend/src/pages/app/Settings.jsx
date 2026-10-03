const platforms = ['Telegram']

const rules = [
  { label: 'Auto-approve score threshold', value: '80' },
  { label: 'Maximum regeneration attempts', value: '2' },
  { label: 'Mode', value: 'Demo' },
]

export default function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-400">Connections and pipeline rules.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="font-semibold text-white">Platform connections</h2>
        <ul className="mt-4 space-y-2">
          {platforms.map((p) => (
            <li key={p} className="flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-sm">
              <span className="text-slate-200">{p}</span>
              <button disabled className="cursor-not-allowed rounded-lg border border-white/10 px-3 py-1 text-slate-500">
                Not connected
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">Connections are set up in Step 13.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="font-semibold text-white">Pipeline rules</h2>
        <ul className="mt-4 space-y-2">
          {rules.map((r) => (
            <li key={r.label} className="flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-sm">
              <span className="text-slate-300">{r.label}</span>
              <span className="font-medium text-white">{r.value}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">Read-only for now.</p>
      </div>
    </div>
  )
}