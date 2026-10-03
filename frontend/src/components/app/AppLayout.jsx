import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import { Outlet, useLocation } from 'react-router-dom'

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const onCreate = location.pathname === '/app/create'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-slate-950/80 px-4 backdrop-blur-md">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          {!onCreate && (
            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs text-amber-300">
              Sample data · not connected yet
            </span>
          )}
          <div className="ml-auto text-sm text-slate-400">Demo user</div>
        </header>

        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}