import { useState } from 'react'
import { Sparkles, Loader2, AlertCircle, Check, Pencil, RefreshCw, X, Send } from 'lucide-react'
import { generatePost, publishPost, updatePost } from '../../lib/api'
import { usePasscode } from '../../lib/passcode'
import TelegramPreview from '../../components/app/TelegramPreview'
import ReviewPanel from '../../components/app/ReviewPanel'
import DraftEditor from '../../components/app/DraftEditor'
import PasscodeField from '../../components/app/PasscodeField'
import ScheduleControls from '../../components/app/ScheduleControls'

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
  const pass = usePasscode()
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
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [draft, setDraft] = useState(null)
  const [postId, setPostId] = useState(null)
  const [saveNote, setSaveNote] = useState('')
  const [edited, setEdited] = useState(false)
  const [stage, setStage] = useState('review')
  const [regenCount, setRegenCount] = useState(0)
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState('')
  const [published, setPublished] = useState(null)
  const [scheduledFor, setScheduledFor] = useState('')

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function save(action, draftArg) {
    if (!postId) return true
    setSaving(true)
    try {
      await updatePost({ id: postId, action, draft: draftArg })
      return true
    } catch (err) {
      setError(`Could not save: ${err.message}`)
      return false
    } finally {
      setSaving(false)
    }
  }

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
      setPostId(null)
    }
    try {
      const data = await generatePost({
        ...form,
        topic,
        replaces: isRegen ? postId : undefined,
      })
      setResult(data)
      setDraft(data.draft)
      setPostId(data.postId)
      setSaveNote(data.saved ? '' : 'This draft could not be saved to the database.')
      setEdited(false)
      setStage('review')
      setPublished(null)
      setScheduledFor('')
      setRegenCount((c) => (isRegen ? c + 1 : 0))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function onPublish() {
    if (!pass.code) {
      setPublishError('Enter the owner passcode.')
      return
    }
    setPublishError('')
    setPublishing(true)
    try {
      const data = await publishPost({ draft, passcode: pass.code, postId })
      setPublished(data)
      setStage('published')
      pass.accept(pass.code)
    } catch (err) {
      if (err.message === 'Invalid passcode') pass.forget()
      setPublishError(err.message)
    } finally {
      setPublishing(false)
    }
  }

  function startOver() {
    setResult(null)
    setDraft(null)
    setPostId(null)
    setSaveNote('')
    setEdited(false)
    setStage('review')
    setRegenCount(0)
    setPublished(null)
    setScheduledFor('')
    setPublishError('')
    setError('')
  }

  const regenLeft = MAX_REGENERATIONS - regenCount
  const busy = loading || saving

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Create content</h1>
        <p className="text-sm text-slate-400">
          Describe the post. AI drafts it and then reviews it. You decide what happens next.
        </p>
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
            <input
              className={inputCls}
              maxLength={150}
              placeholder="Engineering students"
              value={form.targetAudience}
              onChange={set('targetAudience')}
            />
          </Field>
          <Field label="Keywords">
            <input
              className={inputCls}
              maxLength={200}
              placeholder="AI, coding, productivity"
              value={form.keywords}
              onChange={set('keywords')}
            />
          </Field>

          {error && (
            <p className="flex items-start gap-2 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
            </p>
          )}

          <button
            onClick={() => run(false)}
            disabled={busy}
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
              <p className="mt-1 text-sm text-slate-400">
                It was not published and is marked as rejected in your history.
              </p>
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

          {result && draft && stage === 'scheduled' && (
            <div className="rounded-2xl border border-sky-400/30 bg-sky-500/10 p-6">
              <p className="font-semibold text-sky-300">Scheduled</p>
              <p className="mt-1 text-sm text-slate-300">
                This post is set for {new Date(scheduledFor).toLocaleString()}. The automation
                workflow publishes it at that time. You can see or cancel it on the Calendar page.
              </p>
              <button onClick={startOver} className={`${btn} mt-4 bg-indigo-500 text-white hover:bg-indigo-400`}>
                Create another
              </button>
            </div>
          )}

          {result && draft && stage === 'editing' && (
            <DraftEditor
              draft={draft}
              onSave={async (next) => {
                if (await save('edit', next)) {
                  setDraft(next)
                  setEdited(true)
                  setStage('review')
                }
              }}
              onCancel={() => setStage('review')}
            />
          )}

          {result && draft && (stage === 'review' || stage === 'approved') && (
            <>
              <TelegramPreview draft={draft} />

              {saveNote && (
                <p className="rounded-lg bg-amber-500/10 p-3 text-xs text-amber-300">{saveNote}</p>
              )}

              {edited && (
                <p className="rounded-lg bg-amber-500/10 p-3 text-xs text-amber-300">
                  You edited this post after the AI review. The score below applies to the original draft.
                </p>
              )}

              {stage === 'review' && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={async () => {
                      if (await save('approve')) setStage('approved')
                    }}
                    disabled={busy}
                    className={`${btn} bg-emerald-500 text-white hover:bg-emerald-400`}
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button
                    onClick={() => setStage('editing')}
                    disabled={busy}
                    className={`${btn} border border-white/15 text-white hover:bg-white/5`}
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => run(true)}
                    disabled={busy || regenLeft <= 0}
                    className={`${btn} border border-white/15 text-white hover:bg-white/5`}
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                    Regenerate ({Math.max(regenLeft, 0)} left)
                  </button>
                  <button
                    onClick={async () => {
                      if (await save('reject')) setStage('rejected')
                    }}
                    disabled={busy}
                    className={`${btn} border border-rose-400/30 text-rose-300 hover:bg-rose-500/10`}
                  >
                    <X size={16} /> Reject
                  </button>
                </div>
              )}

              {stage === 'approved' && (
                <div className="space-y-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5">
                  <p className="font-semibold text-emerald-300">Approved</p>
                  <p className="text-xs text-slate-400">
                    Your approval is saved. Publishing and scheduling are protected by an owner
                    passcode so only the owner can post to the live channel.
                  </p>

                  <PasscodeField pass={pass} />

                  {publishError && (
                    <p className="flex items-start gap-2 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-300">
                      <AlertCircle size={16} className="mt-0.5 shrink-0" /> Publishing failed: {publishError}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={onPublish}
                      disabled={publishing || saving}
                      className={`${btn} bg-indigo-500 text-white hover:bg-indigo-400`}
                    >
                      {publishing ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                      {publishing ? 'Publishing...' : 'Publish now'}
                    </button>
                    <button
                      onClick={async () => {
                        if (await save('unapprove')) {
                          setStage('review')
                          setPublishError('')
                        }
                      }}
                      disabled={busy}
                      className={`${btn} border border-white/15 text-white hover:bg-white/5`}
                    >
                      Undo approval
                    </button>
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <p className="mb-2 text-sm font-medium text-white">Or schedule it</p>
                    {postId ? (
                      <ScheduleControls
                        postId={postId}
                        pass={pass}
                        onScheduled={(iso) => {
                          setScheduledFor(iso)
                          setStage('scheduled')
                        }}
                      />
                    ) : (
                      <p className="text-xs text-slate-400">
                        Scheduling needs the draft to be saved to the database first.
                      </p>
                    )}
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