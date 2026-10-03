import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { posts } from '../../data/posts'
import PostDetailsModal from '../../components/app/PostDetailsModal'

const pad = (n) => String(n).padStart(2, '0')
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Calendar() {
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selected, setSelected] = useState(null)

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Calendar</h1>
        <p className="text-sm text-slate-400">Scheduled posts by date.</p>
      </div>

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
        <div className="min-w-[700px] rounded-2xl border border-white/10 bg-white/5 p-3">
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
                        onClick={() => setSelected(p)}
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

      <p className="text-xs text-slate-500">
        Editing and cancelling a schedule is added in Step 12, when scheduling is real.
      </p>

      <PostDetailsModal post={selected} onClose={() => setSelected(null)} />
    </div>
  )
}