import { ArrowDown } from 'lucide-react'
import Section from './Section'

function Node({ title, sub, accent }) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-center ${accent ? 'border-indigo-400/40 bg-indigo-500/10' : 'border-white/10 bg-white/5'}`}>
      <p className="font-medium text-white">{title}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  )
}

const Arrow = () => <ArrowDown className="mx-auto my-2 text-slate-500" size={20} />

export default function Architecture() {
  return (
    <Section id="architecture" title="Architecture" subtitle="API keys and credentials never reach the browser.">
      <div className="mx-auto max-w-3xl">
        <Node title="User" sub="Browser" />
        <Arrow />
        <Node title="React frontend" sub="Hosted on Vercel" />
        <Arrow />
        <div className="grid gap-3 sm:grid-cols-2">
          <Node title="Supabase" sub="PostgreSQL, Auth, Storage" />
          <Node title="Backend API" sub="Holds secrets, validates requests" />
        </div>
        <Arrow />
        <Node title="n8n" sub="Workflows: generate, review, approve, schedule, publish" accent />
        <Arrow />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Node title="Groq" sub="AI" />
        <Node title="Supabase" sub="Data" />
        <Node title="Telegram" />
        
</div>
      </div>
    </Section>
  )
}