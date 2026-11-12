import { useState } from 'react'
import { ArrowLeft, FolderPlus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { createProject } from '../services/api.js'

const earliestDueDate = new Date().toISOString().slice(0, 10)

export default function CreateProject() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function submit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    const fields = Object.fromEntries(new FormData(event.currentTarget))
    try {
      const project = createProject({ ...fields, owner: user.name })
      navigate(`/projects/${project.id}`)
    } catch (reason) {
      setError(reason.message || 'Unable to create the project. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page-wrap narrow-page">
      <Link className="back-link" to="/projects"><ArrowLeft size={15} /> All projects</Link>
      <section className="form-panel">
        <div className="form-panel-heading"><span className="panel-icon"><FolderPlus size={19} /></span><div><h2>Start with the basics</h2><p>You can add the handover details as the project takes shape.</p></div></div>
        <form className="form-stack project-form" onSubmit={submit}>
          <label className="form-field">Project name<input name="name" placeholder="e.g. Website refresh" required maxLength={80} /></label>
          <label className="form-field">Client or team<input name="client" placeholder="e.g. Acme Studio" required maxLength={100} /></label>
          <label className="form-field">Project summary<textarea name="description" rows={4} placeholder="What is this project about?" required maxLength={500} /></label>
          <div className="form-row">
            <label className="form-field">Target handover date<input name="dueDate" type="date" min={earliestDueDate} required /></label>
            <label className="form-field">Project owner<input name="owner" defaultValue={user.name} required /></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions"><Link className="button button-quiet" to="/projects">Cancel</Link><button className="button button-primary" disabled={busy}>{busy ? 'Creating…' : 'Create project'}</button></div>
        </form>
      </section>
    </div>
  )
}