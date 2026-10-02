export async function generatePost(input) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || 'Something went wrong. Please try again.')
  }
  return data
}