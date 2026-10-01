import { Link } from 'react-router-dom'
import { Sparkles, Code } from 'lucide-react'
import { GITHUB_URL, APP_PATH } from '../../config'

const links = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Tech', href: '#tech' },
  { label: 'Architecture', href: '#architecture' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-linear-to-br from-indigo-500 to-fuchsia-500">
            <Sparkles size={18} />
          </span>
          SocialFlow AI
        </Link>

        <ul className="hidden gap-8 text-sm text-slate-300 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-white">{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 text-sm text-slate-300 hover:text-white sm:flex"
          >
            <Code size={16} /> GitHub
          </a>
          <Link
            to={APP_PATH}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
          >
            Try it
          </Link>
        </div>
      </nav>
    </header>
  )
}