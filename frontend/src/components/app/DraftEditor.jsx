import { useState } from 'react'

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

export default function DraftEditor({ draft, onSave, onCancel }) {
  const [f, setF] = useState({
    title: draft.title || '',
    hook: draft.hook || '',
    content: draft.content || '',
    callToAction: draft.callToAction || '',
    hashtags: (draft.hashtags || []).join(' '),
  })
  const set = (key) => (e) => setF((s) => ({ ...s, [key]: e.target.value }))
  const empty = !f.content.trim()

  function save() {
    if (empty) return
    const hashtags = f.hashtags
      .split(/[\s,]+/)
      .filter(Boolean)
      .slice(0, 10)
      .map((h) => (h.startsWith('#') ? h : `#${h}`))
    onSave({
      title: f.title.trim(),
      hook: f.hook.trim(),
      content: f.content.trim(),
      callToAction: f.callToAction.trim(),
      hashtags,
    })
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="font-semibold text-white">Edit post</h3>
      <Field label="Title">
        <input className={inputCls} maxLength={200} value={f.title} onChange={set('title')} />
      </Field>
      <Field label="Hook">
        <input className={inputCls} maxLength={300} value={f.hook} onChange={set('hook')} />
      </Field>
      <Field label="Content">
        <textarea className={`${inputCls} h-40 resize-y`} maxLength={3000} value={f.content} onChange={set('content')} />
      </Field>
      <Field label="Call to action">
        <input className={inputCls} maxLength={300} value={f.callToAction} onChange={set('callToAction')} />
      </Field>
      <Field label="Hashtags (separated by spaces)">
        <input className={inputCls} value={f.hashtags} onChange={set('hashtags')} />
      </Field>
      {empty && <p className="text-sm text-rose-300">Content cannot be empty.</p>}
      <div className="flex gap-3">
        <button onClick={save} disabled={empty} className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-50">
          Save changes
        </button>
        <button onClick={onCancel} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5">
          Cancel
        </button>
      </div>
    </div>
  )
}