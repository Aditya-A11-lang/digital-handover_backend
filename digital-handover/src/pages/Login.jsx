import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function submit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      signIn(new FormData(event.currentTarget).get('email'), new FormData(event.currentTarget).get('password'))
      navigate('/dashboard')
    } catch (reason) {
      setError(reason.message || 'Unable to sign in. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <label className="form-field">Email address<input name="email" type="email" placeholder="you@company.com" autoComplete="email" required /></label>
      <label className="form-field">Password<input name="password" type="password" placeholder="Enter your password" autoComplete="current-password" required /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary button-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      <p className="form-hint">Just exploring? Enter any email and password to try the demo.</p>
      <p className="form-mobile-link">New here? <Link to="/signup">Create an account</Link></p>
    </form>
  )
}