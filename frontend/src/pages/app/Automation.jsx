import { ArrowRight } from 'lucide-react'

const components = [
  'Content generation',
  'AI review',
  'Regeneration',
  'Approval',
  'Scheduling',
  'Telegram publishing',
  'Discord publishing',
]

const pipeline = ['Trigger', 'Generate', 'Review', 'Decision', 'Approve', 'Schedule', 'Publish']

const workflows = [
  { name: 'Content generation', text: 'Validates input, calls Groq, saves the draft.' },
  { name: 'Content review', text: 'Scores the draft and branches on the score.' },
  { name: 'Regeneration', text: 'Improves low-scoring drafts, maximum 2 attempts.' },
  { name: 'Approval', text: 'Updates status, then schedules or publishes.' },
  { name: 'Scheduled publishing', text: 'Finds due posts and sends them to the platform.' },
  { name: 'Error handling', text: 'Logs failures from every other workflow.' },
]

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
            <li key={c} className="flex items-center justify-between rounded-lg bg-slate-900 px-4 py-2 text-sm">
              <span className="text-slate-200">{c}</span>
              <span className="text-slate-500">○ Not built yet</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          Statuses will be read from real n8n executions in Step 15. Nothing here is connected yet.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="font-semibold text-white">Pipeline</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {pipeline.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-3 py-2 text-sm text-white">
                {step}
              </span>
              {i < pipeline.length - 1 && <ArrowRight size={16} className="text-slate-500" />}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-white">Planned n8n workflows</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((w, i) => (
            <div key={w.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs text-slate-500">Workflow {i + 1}</p>
              <p className="mt-1 font-medium text-white">{w.name}</p>
              <p className="mt-1 text-sm text-slate-400">{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}