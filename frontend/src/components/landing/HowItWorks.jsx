import { Pencil, Sparkles, ShieldCheck, UserCheck, CalendarClock, Send } from 'lucide-react'
import Section from './Section'

const steps = [
  { icon: Pencil, title: 'Create', text: 'Enter a topic, tone, audience and platform.' },
  { icon: Sparkles, title: 'AI Generates', text: 'Groq drafts the post, hashtags and call to action.' },
  { icon: ShieldCheck, title: 'AI Reviews', text: 'A second AI pass scores quality and suggests fixes.' },
  { icon: UserCheck, title: 'You Approve', text: 'Edit, regenerate, reject or approve. You decide.' },
  { icon: CalendarClock, title: 'Schedule', text: 'Pick a date and time for the post to go out.' },
  { icon: Send, title: 'Publish', text: 'n8n delivers the post to the connected platform.' },
]

export default function HowItWorks() {
  return (
    <Section id="how-it-works" title="How it works" subtitle="Six steps from idea to published post.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-500/20 text-indigo-300">
                <Icon size={20} />
              </span>
              <span className="text-sm text-slate-500">0{i + 1}</span>
            </div>
            <h3 className="mt-4 font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">{text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}