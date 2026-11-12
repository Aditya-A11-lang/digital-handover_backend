const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export async function supabaseRequest(path, { method = 'GET', body, accessToken } = {}) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.')
  }
  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken || anonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Supabase request failed (${response.status}): ${message || response.statusText}`)
  }
  if (response.status === 204) return null
  return response.json()
}