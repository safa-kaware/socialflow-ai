import { Link } from 'react-router-dom'
import { ArrowRight, Code } from 'lucide-react'
import { GITHUB_URL, APP_PATH } from '../../config'

const platforms = ['Telegram', 'Instagram', 'LinkedIn']

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-linear-to-b from-indigo-600/30 to-transparent blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:py-32">
        <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          Portfolio project · In active development
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
          AI-powered social media automation{' '}
          <span className="bg-linear-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            from idea to publication.
          </span>
        </h1>

        <p className="mt-6 text-lg font-medium text-slate-200">
          Generate. Review. Schedule. Publish.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          Describe a post, let AI draft and review it, approve it yourself, and
          let an n8n workflow handle the rest.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={APP_PATH}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 font-medium text-white hover:bg-indigo-400"
          >
            Try SocialFlow AI <ArrowRight size={18} />
          </Link>
          <a
            href="#how-it-works"
            className="rounded-lg border border-white/15 px-6 py-3 font-medium text-white hover:bg-white/5"
          >
            View Demo
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3 font-medium text-white hover:bg-white/5"
          >
            <Code size={18} /> GitHub
          </a>
        </div>

        <div className="mt-12">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Target platforms, integrated one at a time
          </p>
          <div className="mt-3 flex justify-center gap-2">
            {platforms.map((p) => (
              <span key={p} className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}