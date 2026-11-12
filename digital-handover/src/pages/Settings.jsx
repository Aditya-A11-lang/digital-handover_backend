import { useState } from 'react'
import { Check, CircleUserRound, KeyRound, Save, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Settings() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Your name cannot be empty.')
      return
    }
    try {
      updateUser({ name: name.trim() })
      setSaved(true)
      setError('')
      window.setTimeout(() => setSaved(false), 2500)
    } catch (reason) {
      setError(reason.message || 'Unable to save your profile.')
    }
  }

  return (
    <div className="page-wrap settings-layout">
      <nav className="settings-nav" aria-label="Settings sections"><span className="eyebrow">PREFERENCES</span><a className="settings-nav-active" href="#profile"><CircleUserRound size={16} /> Profile</a><a href="#security"><ShieldCheck size={16} /> Security</a></nav>
      <div className="settings-sections">
        <section className="section-panel settings-panel" id="profile"><div className="panel-heading"><div><h2>Your profile</h2><p>Keep your account details up to date.</p></div></div>
          <form className="settings-form" onSubmit={submit}><div className="settings-avatar"><span className="avatar avatar-large">{user?.name?.slice(0, 1).toUpperCase() || 'U'}</span><div><strong>Profile photo</strong><small>Your initials are shown around your workspace.</small></div></div>
            <label className="form-field">Full name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required /></label><label className="form-field">Email address<input value={user?.email || ''} disabled /><small className="field-note">Your sign-in email can’t be changed in this demo.</small></label>
            {error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary" type="submit">{saved ? <Check size={16} /> : <Save size={16} />}{saved ? 'Changes saved' : 'Save changes'}</button>
          </form>
        </section>
        <section className="section-panel settings-panel" id="security"><div className="panel-heading"><div><h2>Security & privacy</h2><p>A note about how this demo keeps your information.</p></div><KeyRound size={18} /></div><div className="privacy-note"><ShieldCheck size={18} /><p>Your profile and project data are stored in this browser only. This prototype does not send your data to a server, and its demo sign-in is not suitable for real accounts.</p></div></section>
      </div>
    </div>
  )
}