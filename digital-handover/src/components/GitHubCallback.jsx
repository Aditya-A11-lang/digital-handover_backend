import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { exchangeGithubToken } from '../api/services.js'

const TEAM_ID_STORAGE_KEY = 'current_team_id'
const TEAM_ID_PLACEHOLDER = 'replace-with-current-team-id'

export default function GitHubCallback() {
  const navigate = useNavigate()
  const hasStartedRef = useRef(false)
  const initialParams = new URLSearchParams(window.location.search)
  const initialError = initialParams.get('error')
  const initialCode = initialParams.get('code')
  const initialState = initialParams.get('state')
  const expectedState = localStorage.getItem('github_oauth_state')
  const [status, setStatus] = useState(() => {
    if (initialError) return { type: 'error', message: 'Connection Denied' }
    if (expectedState && initialState !== expectedState) return { type: 'error', message: 'GitHub authorization could not be verified.' }
    if (!initialCode) return { type: 'error', message: 'No GitHub authorization code was provided.' }
    return { type: 'loading', message: 'Connecting to GitHub...' }
  })

  useEffect(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const error = params.get('error')
    const state = params.get('state')
    const savedState = localStorage.getItem('github_oauth_state')

    if (error) {
      localStorage.removeItem('github_oauth_state')
      return
    }

    if (!code) {
      return
    }

    if (savedState && state !== savedState) {
      localStorage.removeItem('github_oauth_state')
      return
    }
    localStorage.removeItem('github_oauth_state')

    const teamId = localStorage.getItem(TEAM_ID_STORAGE_KEY) || TEAM_ID_PLACEHOLDER

    exchangeGithubToken({ code, team_id: teamId })
      .then(() => navigate('/dashboard', { replace: true }))
      .catch((reason) => {
        setStatus({ type: 'error', message: reason.message || 'Unable to connect to GitHub.' })
      })
  }, [navigate])

  return (
    <main className="page-wrap" aria-live="polite">
      {status.type === 'loading' ? <p>{status.message}</p> : <p className="form-error" role="alert">{status.message}</p>}
    </main>
  )
}
