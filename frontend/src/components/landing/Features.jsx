import { Sparkles, ShieldCheck, UserCheck, CalendarClock, TrendingUp, Workflow, Share2 } from 'lucide-react'
import Section from './Section'

const features = [
  { icon: Sparkles, title: 'AI Content Generation', text: 'Platform-aware drafts with hooks, hashtags and calls to action.' },
  { icon: ShieldCheck, title: 'AI Review', text: 'An AI-generated quality score with specific issues and suggestions. It is an estimate, not a guarantee.' },
  { icon: UserCheck, title: 'Human Approval', text: 'Nothing is published without your approval.' },
  { icon: CalendarClock, title: 'Scheduling', text: 'Plan posts on a calendar and let automation send them on time.' },
  { icon: TrendingUp, title: 'Analytics', text: 'Track generated, approved, scheduled and published posts.' },
  { icon: Workflow, title: 'n8n Automation', text: 'Modular workflows handle generation, review, retries and errors.' },
 { icon: Share2, title: 'Multi-platform', text: 'Telegram and Discord first, built behind a common adapter design so more platforms can follow.' },
]

export default function Features() {
  return (
    <Section id="features" title="Features" subtitle="What SocialFlow AI is designed to do.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-indigo-400/40">
            <Icon className="text-indigo-300" size={22} />
            <h3 className="mt-4 font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">{text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}