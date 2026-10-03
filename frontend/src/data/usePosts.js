import { useEffect, useState } from 'react'
import { listPosts } from '../lib/api'

const pad = (n) => String(n).padStart(2, '0')
const localDay = (iso) => {
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const normalize = (r) => ({
  id: r.id,
  topic: r.topic,
  platform: r.platform,
  status: r.status,
  score: r.ai_score,
  createdAt: localDay(r.created_at),
  scheduledFor: null,
  title: r.title,
  hook: r.hook,
  content: r.content,
  hashtags: r.hashtags || [],
  callToAction: r.call_to_action,
})

export function usePosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    listPosts()
      .then((rows) => alive && setPosts(rows.map(normalize)))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  return { posts, loading, error }
}