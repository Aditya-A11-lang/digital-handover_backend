import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TEAM_ID_STORAGE_KEY = 'current_team_id'
const TEAM_ID_PLACEHOLDER = 'replace-with-current-team-id'

export default function GitHubCallback() {
  const navigate = useNavigate()
  const hasStartedRef = useRef(false)
  const initialParams = new URLSearchParams(window.location.search)
  const initialError = initialParams.get('error')
  const initialCode = initialParams.get('code')
  const [status, setStatus] = useState(() => {
    if (initialError) return { type: 'error', message: 'Connection Denied' }
    if (!initialCode) return { type: 'error', message: 'No GitHub authorization code was provided.' }
    return { type: 'loading', message: 'Connecting to GitHub...' }
  })

  useEffect(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const error = params.get('error')

    if (error) {
      return
    }

    if (!code) {
      return
    }

    const controller = new AbortController()
    const teamId = localStorage.getItem(TEAM_ID_STORAGE_KEY) || TEAM_ID_PLACEHOLDER

    fetch('http://localhost:8000/github/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, team_id: teamId }),
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('GitHub connection failed.')
        return response.json()
      })
      .then(() => navigate('/dashboard', { replace: true }))
      .catch((reason) => {
        if (reason.name !== 'AbortError') {
          setStatus({ type: 'error', message: reason.message || 'Unable to connect to GitHub.' })
        }
      })

    return () => controller.abort()
  }, [navigate])

  return (
    <main className="page-wrap" aria-live="polite">
      {status.type === 'loading' ? <p>{status.message}</p> : <p className="form-error" role="alert">{status.message}</p>}
    </main>
  )
}
