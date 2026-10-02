import { useState } from 'react'
import { Sparkles, Loader2, AlertCircle } from 'lucide-react'
import { generatePost } from '../../lib/api'
import TelegramPreview from '../../components/app/TelegramPreview'
import ReviewPanel from '../../components/app/ReviewPanel'

const CONTENT_TYPES = ['Educational', 'Thought Leadership', 'Promotional', 'Announcement', 'Tips', 'Question', 'Story', 'Motivational']
const TONES = ['Professional', 'Friendly', 'Inspirational', 'Technical', 'Conversational', 'Bold']
const LENGTHS = ['Short', 'Medium', 'Long']

const inputCls =
  'w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-300">{label}</span>
      {children}
    </label>
  )
}

export default function Create() {
  const [form, setForm] = useState({
    topic: '',
    platform: 'Telegram',
    contentType: 'Educational',
    tone: 'Professional',
    targetAudience: '',
    keywords: '',
    length: 'Medium',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onGenerate() {
    const topic = form.topic.trim()
    if (!topic) {
      setError('Please enter a topic.')
      return
    }
    setError('')
    setResult(null)
    setLoading(true)
    try {
      setResult(await generatePost({ ...form, topic }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Create content</h1>
        <p className="text-sm text-slate-400">Describe the post. AI drafts it and then reviews it.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <Field label="Topic">
            <textarea
              className={`${inputCls} h-24 resize-none`}
              maxLength={300}
              placeholder="How generative AI is changing software development"
              value={form.topic}
              onChange={set('topic')}
            />
            <span className="mt-1 block text-right text-xs text-slate-500">{form.topic.length}/300</span>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Platform">
              <select className={inputCls} value={form.platform} onChange={set('platform')}>
                <option value="Telegram">Telegram</option>
                <option value="Discord" disabled>Discord (coming soon)</option>
              </select>
            </Field>
            <Field label="Length">
              <select className={inputCls} value={form.length} onChange={set('length')}>
                {LENGTHS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Content type">
              <select className={inputCls} value={form.contentType} onChange={set('contentType')}>
                {CONTENT_TYPES.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Tone">
              <select className={inputCls} value={form.tone} onChange={set('tone')}>
                {TONES.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Target audience">
            <input className={inputCls} maxLength={150} placeholder="Engineering students" value={form.targetAudience} onChange={set('targetAudience')} />
          </Field>
          <Field label="Keywords">
            <input className={inputCls} maxLength={200} placeholder="AI, coding, productivity" value={form.keywords} onChange={set('keywords')} />
          </Field>

          {error && (
            <p className="flex items-start gap-2 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
            </p>
          )}

          <button
            onClick={onGenerate}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-3 font-medium text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {loading ? 'Generating and reviewing...' : 'Generate content'}
          </button>
          {loading && (
            <p className="text-center text-xs text-slate-500">
              This runs two AI calls and can take up to about 40 seconds.
            </p>
          )}
        </div>

        <div className="space-y-4">
          {!result && !loading && (
            <div className="grid h-full min-h-64 place-items-center rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
              Your draft and its AI review will appear here.
            </div>
          )}
          {result && (
            <>
              <TelegramPreview draft={result.draft} />
              <ReviewPanel review={result.review} passed={result.passed} attempts={result.attempts} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}