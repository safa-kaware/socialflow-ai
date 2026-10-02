import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, PenSquare, ListChecks, CalendarDays,
  History, BarChart3, Workflow, Settings, Sparkles, X,
} from 'lucide-react'

const items = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/create', label: 'Create', icon: PenSquare },
  { to: '/app/queue', label: 'Queue', icon: ListChecks },
  { to: '/app/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/app/history', label: 'History', icon: History },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/automation', label: 'Automation', icon: Workflow },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-slate-950 p-4 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-linear-to-br from-indigo-500 to-fuchsia-500">
              <Sparkles size={18} />
            </span>
            SocialFlow AI
          </Link>
          <button className="lg:hidden" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-indigo-500/15 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}