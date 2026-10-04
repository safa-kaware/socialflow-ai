import { ArrowRight } from 'lucide-react'

const STATE = {
  live: { label: 'Live', cls: 'text-emerald-300', dot: '●' },
  progress: { label: 'In progress', cls: 'text-amber-300', dot: '◐' },
  planned: { label: 'Not built yet', cls: 'text-slate-500', dot: '○' },
}

const components = [
  { name: 'Content generation', state: 'live', note: 'n8n workflow calling Groq' },
  { name: 'AI review', state: 'live', note: 'second Groq call in the same workflow' },
  { name: 'Regeneration', state: 'live', note: 'automatic retry, maximum 2 attempts' },
  { name: 'Approval', state: 'live', note: 'human approval in the web app, saved to the database' },
  { name: 'Telegram publishing', state: 'live', note: 'n8n workflow, owner passcode required' },
 { name: 'Scheduling', state: 'planned', note: 'the calendar and scheduling code exist, but the n8n workflow that sends due posts is not built, so scheduling is switched off' },
  { name: 'Central error workflow', state: 'planned', note: 'Groq calls retry and Telegram failures are reported, but there is no dedicated error workflow yet' },
]

const pipeline = [
  { step: 'Trigger', where: 'Web app' },
  { step: 'Generate', where: 'n8n + Groq' },
  { step: 'Review', where: 'n8n + Groq' },
  { step: 'Decision', where: 'n8n' },
  { step: 'Approve', where: 'Web app' },
  { step: 'Schedule', where: 'Web app + database' },
  { step: 'Publish', where: 'n8n + Telegram' },
]

const workflows = [
  {
    name: 'Generate and review',
    state: 'live',
    text: 'Validates input, generates a draft with Groq, reviews it with a second call, retries low-scoring drafts up to 2 times, and returns the draft with its scores.',
  },
  {
    name: 'Publish to Telegram',
    state: 'live',
    text: 'Publishes an approved post to the channel and reports success or failure honestly.',
  },
  {
    name: 'Scheduled publishing',
    state: 'planned',
    text: 'Runs on a timer, finds due scheduled posts, publishes them and records the result.',
  },
  {
    name: 'Central error handling',
    state: 'planned',
    text: 'Collects failures from every workflow into one log.',
  },
]

function Status({ state }) {
  const s = STATE[state]
  return (
    <span className={`shrink-0 text-xs ${s.cls}`}>
      {s.dot} {s.label}
    </span>
  )
}

export default function Automation() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Automation</h1>
        <p className="text-sm text-slate-400">How n8n powers the pipeline.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="font-semibold text-white">Automation status</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {components.map((c) => (
            <li key={c.name} className="rounded-lg bg-slate-900 px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-200">{c.name}</span>
                <Status state={c.state} />
              </div>
              <p className="mt-1 text-xs text-slate-500">{c.note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          These labels describe what has been built. They are not a live health check of n8n.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="font-semibold text-white">Pipeline and where each step runs</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {pipeline.map((p, i) => (
            <div key={p.step} className="flex items-center gap-2">
              <div className="rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-3 py-2 text-center">
                <p className="text-sm text-white">{p.step}</p>
                <p className="text-xs text-slate-400">{p.where}</p>
              </div>
              {i < pipeline.length - 1 && <ArrowRight size={16} className="text-slate-500" />}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-white">n8n workflows</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {workflows.map((w, i) => (
            <div key={w.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">Workflow {i + 1}</p>
                <Status state={w.state} />
              </div>
              <p className="mt-1 font-medium text-white">{w.name}</p>
              <p className="mt-1 text-sm text-slate-400">{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}