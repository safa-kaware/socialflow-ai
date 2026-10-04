import { useEffect, useState } from 'react'
import { listPosts } from '../lib/api'

const REPLACED_NOTE = 'Replaced by a regenerated draft'

const pad = (n) => String(n).padStart(2, '0')
const localDay = (iso) => {
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
const localIso = (iso) => {
  const d = new Date(iso)
  return `${localDay(iso)}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const normalize = (r) => ({
  id: r.id,
  topic: r.topic,
  platform: r.platform,
  status: r.status === 'rejected' && r.error_message === REPLACED_NOTE ? 'regenerated' : r.status,
  score: r.ai_score,
  createdAt: localDay(r.created_at),
  scheduledFor: r.scheduled_for ? localIso(r.scheduled_for) : null,
  scheduledLabel: r.scheduled_for ? new Date(r.scheduled_for).toLocaleString() : '',
  title: r.title,
  hook: r.hook,
  content: r.content,
  hashtags: r.hashtags || [],
  callToAction: r.call_to_action,
  errorMessage: r.error_message,
  externalId: r.external_post_id,
})

export function usePosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let alive = true
    listPosts()
      .then((rows) => alive && setPosts(rows.map(normalize)))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [tick])

  return { posts, loading, error, reload: () => setTick((t) => t + 1) }
}