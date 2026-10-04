const SESSION_KEY = 'socialflow_session'
let fallbackId

function sessionId() {
  try {
    let id = localStorage.getItem(SESSION_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    fallbackId ??= crypto.randomUUID()
    return fallbackId
  }
}

async function request(url, { method = 'GET', body } = {}) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'x-session-id': sessionId() },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok || !data?.ok) {
    const base = data?.error || 'Something went wrong. Please try again.'
    throw new Error(data?.details ? `${base}: ${data.details}` : base)
  }
  return data
}

export const generatePost = (input) => request('/api/generate', { method: 'POST', body: input })
export const publishPost = ({ draft, passcode, postId }) =>
  request('/api/publish', { method: 'POST', body: { draft, passcode, postId } })
export const listPosts = async () => (await request('/api/posts')).posts
export const updatePost = ({ id, action, draft }) =>
  request('/api/posts', { method: 'POST', body: { id, action, draft } })
export const schedulePost = ({ postId, passcode, scheduledFor }) =>
  request('/api/schedule', { method: 'POST', body: { postId, passcode, scheduledFor } })