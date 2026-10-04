export default function PasscodeField({ pass }) {
  if (pass.saved) {
    return (
      <p className="text-xs text-slate-400">
        Owner actions are unlocked for this browser session.{' '}
        <button className="underline hover:text-white" onClick={pass.forget}>
          Lock again
        </button>
      </p>
    )
  }

  return (
    <input
      type="password"
      autoComplete="off"
      className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400"
      placeholder="Owner passcode (asked once per session)"
      value={pass.typed}
      onChange={(e) => pass.setTyped(e.target.value)}
    />
  )
}