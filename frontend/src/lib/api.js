async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok || !data?.ok) {
    const base = data?.error || 'Something went wrong. Please try again.'
    throw new Error(data?.details ? `${base}: ${data.details}` : base)
  }
  return data
}

export const generatePost = (input) => postJson('/api/generate', input)
export const publishPost = ({ draft, passcode }) => postJson('/api/publish', { draft, passcode })