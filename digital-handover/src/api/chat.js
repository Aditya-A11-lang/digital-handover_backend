export async function askAssistant({ message, history = [], projects = [] }) {
  const accessToken = localStorage.getItem('access_token') || localStorage.getItem('token')
  if (!accessToken) throw new Error('Sign in again to use the handover assistant.')

  let response
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ message, history, projects }),
    })
  } catch {
    throw new Error('Unable to reach the handover assistant. Please try again.')
  }

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(payload?.error || `Assistant request failed (HTTP ${response.status}).`)
  }
  if (typeof payload?.reply !== 'string' || !payload.reply.trim()) {
    throw new Error('The assistant returned an empty response. Please try again.')
  }
  return payload.reply.trim()
}
