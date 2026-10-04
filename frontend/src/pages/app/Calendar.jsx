import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePosts } from '../../data/usePosts'
import { updatePost } from '../../lib/api'
import { usePasscode } from '../../lib/passcode'
import PostDetailsModal from '../../components/app/PostDetailsModal'
import PasscodeField from '../../components/app/PasscodeField'
import ScheduleControls from '../../components/app/ScheduleControls'
import { SCHEDULING_ENABLED } from '../../config'

const pad = (n) => String(n).padStart(2, '0')
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Calendar() {
  const { posts, loading, error, reload } = usePosts()
  const pass = usePasscode()
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selected, setSelected] = useState(null)
  const [actionError, setActionError] = useState('')

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const now = new Date()
  const todayKey = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

  const scheduled = posts.filter((p) => p.status === 'scheduled' && p.scheduledFor)
  const keyFor = (day) => `${year}-${pad(month + 1)}-${pad(day)}`
  const postsOn = (day) => scheduled.filter((p) => p.scheduledFor.startsWith(keyFor(day)))

  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  const title = cursor.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const move = (delta) => setCursor(new Date(year, month + delta, 1))

  async function cancelSchedule() {
    setActionError('')
    try {
      await updatePost({ id: selected.id, action: 'unschedule' })
      setSelected(null)
      reload()
    } catch (err) {
      setActionError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Calendar</h1>
        <p className="text-sm text-slate-400">Scheduled posts by date, in your local time.</p>
      </div>

      {error && (
        <p className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-300">Could not load posts: {error}</p>
      )}

      <div className="flex items-center gap-3">
        <button onClick={() => move(-1)} className="rounded-lg border border-white/10 p-2 hover:bg-white/5" aria-label="Previous month">
          <ChevronLeft size={18} />
        </button>
        <h2 className="w-44 text-center font-semibold text-white">{title}</h2>
        <button onClick={() => move(1)} className="rounded-lg border border-white/10 p-2 hover:bg-white/5" aria-label="Next month">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-175 rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="grid grid-cols-7 text-center text-xs text-slate-500">
            {weekdays.map((d) => (
              <div key={d} className="pb-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) =>
              day === null ? (
                <div key={`empty-${i}`} />
              ) : (
                <div
                  key={day}
                  className={`min-h-24 rounded-lg border p-2 ${
                    keyFor(day) === todayKey ? 'border-indigo-400/60' : 'border-white/10'
                  }`}
                >
                  <p className="text-xs text-slate-400">{day}</p>
                  <div className="mt-1 space-y-1">
                    {postsOn(day).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActionError('')
                          setSelected(p)
                        }}
                        className="block w-full truncate rounded bg-sky-500/15 px-1.5 py-1 text-left text-xs text-sky-300"
                      >
                        {p.scheduledFor.slice(11, 16)} {p.topic}
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {!loading && scheduled.length === 0 && !error && (
        <p className="text-sm text-slate-500">
          Nothing is scheduled. Approve a post on the Create page, then schedule it.
        </p>
      )}

      <PostDetailsModal post={selected} onClose={() => setSelected(null)}>
        {selected?.status === 'scheduled' && (
          <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
            <p className="text-sm text-slate-300">Scheduled for {selected.scheduledLabel}</p>
            <button
              onClick={cancelSchedule}
              className="rounded-lg border border-rose-400/30 px-4 py-2 text-sm text-rose-300 hover:bg-rose-500/10"
            >
              Cancel schedule
            </button>
            <p className="pt-2 text-sm font-medium text-white">Change the time</p>
            <PasscodeField pass={pass} />
            <ScheduleControls
              postId={selected.id}
              pass={pass}
              label="Reschedule"
              onScheduled={() => {
                setSelected(null)
                reload()
              }}
            />
            {!SCHEDULING_ENABLED && (
  <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
    Scheduling is not enabled in this version. This calendar will show scheduled posts once the
    automation that publishes them is added.
  </p>
)}
            {actionError && <p className="text-sm text-rose-300">{actionError}</p>}
          </div>
        )}
      </PostDetailsModal>
    </div>
  )
}