import { useState } from 'react'
import { Sparkles, Loader2, AlertCircle, Check, Pencil, RefreshCw, X, Send } from 'lucide-react'
import { generatePost, publishPost } from '../../lib/api'
import TelegramPreview from '../../components/app/TelegramPreview'
import ReviewPanel from '../../components/app/ReviewPanel'
import DraftEditor from '../../components/app/DraftEditor'

const CONTENT_TYPES = ['Educational', 'Thought Leadership', 'Promotional', 'Announcement', 'Tips', 'Question', 'Story', 'Motivational']
const TONES = ['Professional', 'Friendly', 'Inspirational', 'Technical', 'Conversational', 'Bold']
const LENGTHS = ['Short', 'Medium', 'Long']
const MAX_REGENERATIONS = 2

const inputCls =
  'w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400'
const btn = 'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50'

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
  const [draft, setDraft] = useState(null)
  const [edited, setEdited] = useState(false)
  const [stage, setStage] = useState('review')
  const [regenCount, setRegenCount] = useState(0)
  const [passcode, setPasscode] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState('')
  const [published, setPublished] = useState(null)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function run(isRegen) {
    const topic = form.topic.trim()
    if (!topic) {
      setError('Please enter a topic.')
      return
    }
    setError('')
    setPublishError('')
    setLoading(true)
    if (!isRegen) {
      setResult(null)
      setDraft(null)
    }
    try {
      const data = await generatePost({ ...form, topic })
      setResult(data)
      setDraft(data.draft)
      setEdited(false)
      setStage('review')
      setPublished(null)
      setRegenCount((c) => (isRegen ? c + 1 : 0))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function onPublish() {
    if (!passcode) {
      setPublishError('Enter the publish passcode.')
      return
    }
    setPublishError('')
    setPublishing(true)
    try {
      const data = await publishPost({ draft, passcode })
      setPublished(data)
      setStage('published')
      setPasscode('')
    } catch (err) {
      setPublishError(err.message)
    } finally {
      setPublishing(false)
    }
  }

  function startOver() {
    setResult(null)
    setDraft(null)
    setEdited(false)
    setStage('review')
    setRegenCount(0)
    setPublished(null)
    setPublishError('')
    setError('')
  }

  const regenLeft = MAX_REGENERATIONS - regenCount

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Create content</h1>
        <p className="text-sm text-slate-400">Describe the post. AI drafts it and then reviews it. You decide what happens next.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 lg:self-start">
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
            onClick={() => run(false)}
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

          {result && draft && stage === 'rejected' && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="font-semibold text-white">Draft rejected</p>
              <p className="mt-1 text-sm text-slate-400">It was not published and has not been saved.</p>
              <button onClick={startOver} className={`${btn} mt-4 bg-indigo-500 text-white hover:bg-indigo-400`}>
                Start over
              </button>
            </div>
          )}

          {result && draft && stage === 'published' && (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6">
              <p className="font-semibold text-emerald-300">Published to Telegram</p>
              <p className="mt-1 text-sm text-slate-300">
                The automation confirmed that Telegram accepted the post.
                {published?.messageId ? ` Message ID: ${published.messageId}.` : ''}
              </p>
              <button onClick={startOver} className={`${btn} mt-4 bg-indigo-500 text-white hover:bg-indigo-400`}>
                Create another
              </button>
            </div>
          )}

          {result && draft && stage === 'editing' && (
            <DraftEditor
              draft={draft}
              onSave={(next) => {
                setDraft(next)
                setEdited(true)
                setStage('review')
              }}
              onCancel={() => setStage('review')}
            />
          )}

          {result && draft && (stage === 'review' || stage === 'approved') && (
            <>
              <TelegramPreview draft={draft} />

              {edited && (
                <p className="rounded-lg bg-amber-500/10 p-3 text-xs text-amber-300">
                  You edited this post after the AI review. The score below applies to the original draft.
                </p>
              )}

              {stage === 'review' && (
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setStage('approved')} className={`${btn} bg-emerald-500 text-white hover:bg-emerald-400`}>
                    <Check size={16} /> Approve
                  </button>
                  <button onClick={() => setStage('editing')} className={`${btn} border border-white/15 text-white hover:bg-white/5`}>
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => run(true)}
                    disabled={loading || regenLeft <= 0}
                    className={`${btn} border border-white/15 text-white hover:bg-white/5`}
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                    Regenerate ({Math.max(regenLeft, 0)} left)
                  </button>
                  <button onClick={() => setStage('rejected')} className={`${btn} border border-rose-400/30 text-rose-300 hover:bg-rose-500/10`}>
                    <X size={16} /> Reject
                  </button>
                </div>
              )}

              {stage === 'approved' && (
                <div className="space-y-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5">
                  <p className="font-semibold text-emerald-300">Approved</p>
                  <p className="text-xs text-slate-400">
                    Approvals are not saved yet; saving arrives with the database step. Publishing is
                    protected by a passcode so only the owner can post to the live channel.
                  </p>
                  <input
                    type="password"
                    autoComplete="off"
                    className={inputCls}
                    placeholder="Publish passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                  />
                  {publishError && (
                    <p className="flex items-start gap-2 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-300">
                      <AlertCircle size={16} className="mt-0.5 shrink-0" /> Publishing failed: {publishError}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button onClick={onPublish} disabled={publishing} className={`${btn} bg-indigo-500 text-white hover:bg-indigo-400`}>
                      {publishing ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                      {publishing ? 'Publishing...' : 'Publish to Telegram'}
                    </button>
                    <button onClick={() => { setStage('review'); setPublishError('') }} className={`${btn} border border-white/15 text-white hover:bg-white/5`}>
                      Undo approval
                    </button>
                  </div>
                </div>
              )}

              <ReviewPanel review={result.review} passed={result.passed} attempts={result.attempts} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}