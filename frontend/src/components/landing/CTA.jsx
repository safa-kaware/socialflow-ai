import { Link } from 'react-router-dom'
import { APP_PATH } from '../../config'

export default function CTA() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20">
      <div className="rounded-3xl border border-white/10 bg-linear-to-br from-indigo-600/30 to-fuchsia-600/20 p-10 text-center">
        <h2 className="text-3xl font-bold text-white">Start Creating with AI</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">
          Try the workflow from idea to approved post.
        </p>
        <Link
          to={APP_PATH}
          className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-medium text-slate-900 hover:bg-slate-200"
        >
          Try SocialFlow AI
        </Link>
      </div>
    </section>
  )
}