import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function submit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    const form = new FormData(event.currentTarget)
    try {
      signUp({ name: form.get('name'), email: form.get('email'), password: form.get('password') })
      navigate('/dashboard')
    } catch (reason) {
      setError(reason.message || 'Unable to create your account. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <label className="form-field">Your name<input name="name" type="text" placeholder="Alex Morgan" autoComplete="name" required /></label>
      <label className="form-field">Work email<input name="email" type="email" placeholder="you@company.com" autoComplete="email" required /></label>
      <label className="form-field">Password<input name="password" type="password" placeholder="At least 8 characters" minLength={8} autoComplete="new-password" required /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary button-full" disabled={busy}>{busy ? 'Creating workspace…' : 'Create your account'}</button>
      <p className="form-hint">By continuing, you agree to keep your team’s handover details thoughtful and tidy.</p>
      <p className="form-mobile-link">Already have an account? <Link to="/login">Sign in</Link></p>
    </form>
  )
}