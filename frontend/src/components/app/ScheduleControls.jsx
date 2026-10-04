import { useState } from 'react'
import { CalendarClock, Loader2, AlertCircle } from 'lucide-react'
import { schedulePost } from '../../lib/api'

const pad = (n) => String(n).padStart(2, '0')
const toLocalInput = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`

export default function ScheduleControls({ postId, pass, onScheduled, label = 'Schedule' }) {
  const [when, setWhen] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const min = toLocalInput(new Date(new Date().getTime() + 5 * 60 * 1000))

  async function submit() {
    if (!when) {
      setError('Choose a date and time.')
      return
    }
    if (!pass.code) {
      setError('Enter the owner passcode.')
      return
    }
    setError('')
    setBusy(true)
    try {
      const data = await schedulePost({
        postId,
        passcode: pass.code,
        scheduledFor: new Date(when).toISOString(),
      })
      pass.accept(pass.code)
      onScheduled(data.scheduledFor)
    } catch (err) {
      if (err.message === 'Invalid passcode') pass.forget()
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="datetime-local"
          min={min}
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400"
        />
        <button
          onClick={submit}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/5 disabled:opacity-50"
        >
          {busy ? <Loader2 className="animate-spin" size={16} /> : <CalendarClock size={16} />}
          {label}
        </button>
      </div>
      {error && (
        <p className="flex items-start gap-2 text-sm text-rose-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  )
}