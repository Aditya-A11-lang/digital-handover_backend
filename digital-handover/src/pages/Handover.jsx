import { useEffect, useState } from 'react'
import { ArrowLeft, CalendarDays, Check, CircleCheck, Download, FileText, Link2, MessageSquareText, Plus, UserRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { getProject, updateProject } from '../services/api.js'

export default function Handover() {
  const { projectId } = useParams()
  const [project, setProject] = useState(() => getProject(projectId))
  const [error, setError] = useState('')

  useEffect(() => {
    setProject(getProject(projectId))
    setError('')
  }, [projectId])

  if (!project) return <div className="page-wrap"><div className="empty-state"><h2>Project not found</h2><p>This handover may have been removed.</p><Link className="button button-primary" to="/projects">Back to projects</Link></div></div>

  const completed = project.checklist.filter((item) => item.done).length
  const progress = project.checklist.length ? Math.round((completed / project.checklist.length) * 100) : 0

  function toggleTask(taskId) {
    const checklist = project.checklist.map((task) => task.id === taskId ? { ...task, done: !task.done } : task)
    const allDone = checklist.every((task) => task.done)
    try {
      setProject(updateProject(project.id, { checklist, ...(allDone ? { status: 'Completed' } : project.status === 'Completed' ? { status: 'In progress' } : {}) }))
      setError('')
    } catch (reason) {
      setError(reason.message || 'Unable to save this checklist update.')
    }
  }

  function changeStatus(event) {
    try {
      setProject(updateProject(project.id, { status: event.target.value }))
      setError('')
    } catch (reason) {
      setError(reason.message || 'Unable to update project status.')
    }
  }

  return (
    <div className="page-wrap">
      <Link className="back-link" to="/projects"><ArrowLeft size={15} /> All projects</Link>
      {error && <p className="form-error" role="alert">{error}</p>}
      <section className="handover-heading">
        <div className="handover-title-row"><span className={`project-emblem emblem-${project.color}`}>{project.name.slice(0, 1)}</span><div><span className="eyebrow">{project.client}</span><h2>{project.name}</h2></div><StatusBadge status={project.status} /></div>
        <p>{project.description}</p>
        <div className="handover-meta"><span><UserRound size={15} /> {project.owner}</span><span><CalendarDays size={15} /> Due {new Date(`${project.dueDate}T12:00:00`).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</span><label className="status-select-label">Status <select value={project.status} onChange={changeStatus}><option>Planning</option><option>In progress</option><option>Review</option><option>Completed</option></select></label></div>
      </section>
      <div className="handover-layout">
        <section className="section-panel checklist-panel">
          <div className="panel-heading"><div><h2>Handover checklist</h2><p>Tick things off as your team gets them ready.</p></div><span className="checklist-count">{completed}/{project.checklist.length}</span></div>
          <div className="handover-progress"><ProgressBar value={progress} /><span>{progress}% complete</span></div>
          <div className="checklist-items">{project.checklist.map((task) => <label className={`checklist-row${task.done ? ' task-done' : ''}`} key={task.id}><input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} /><span className="custom-checkbox">{task.done && <Check size={13} />}</span><span className="checklist-task-copy"><strong>{task.title}</strong><small><UserRound size={12} /> {task.owner}</small></span><CircleCheck className="checklist-check-icon" size={17} /></label>)}</div>
          {progress === 100 && <div className="completion-note"><CircleCheck size={18} /><span><strong>All wrapped up!</strong> This handover checklist is complete.</span></div>}
          <button type="button" className="add-checklist-button" onClick={() => {
            const title = window.prompt('What else needs to be handed over?')
            if (title?.trim()) setProject(updateProject(project.id, { checklist: [...project.checklist, { id: crypto.randomUUID(), title: title.trim(), owner: project.owner, done: false }] }))
          }}><Plus size={15} /> Add checklist item</button>
        </section>
        <aside className="handover-side-column">
          <section className="section-panel handover-info"><div className="panel-heading"><div><h2>Handover essentials</h2><p>Helpful details for the next team.</p></div></div><div className="essential-row"><span><FileText size={16} /></span><div><strong>Project overview</strong><small>Scope, goals, and context</small></div><button type="button" aria-label="Add project overview" onClick={() => window.alert('Add your project overview to the checklist items above.')}><Plus size={16} /></button></div><div className="essential-row"><span><Link2 size={16} /></span><div><strong>Access & resources</strong><small>Links, tools, and repositories</small></div><button type="button" aria-label="Add resources" onClick={() => window.alert('Add your important access links to the checklist items above.')}><Plus size={16} /></button></div><div className="essential-row"><span><MessageSquareText size={16} /></span><div><strong>Open questions</strong><small>Decisions and follow-ups</small></div><button type="button" aria-label="Add open questions" onClick={() => window.alert('Add open questions to the checklist items above.')}><Plus size={16} /></button></div></section>
          <section className="handover-share-card"><span><Download size={18} /></span><h3>Ready to share?</h3><p>Your handover is easier when everyone knows where to look.</p><button className="button button-dark button-full" type="button" onClick={() => window.print()}>Print handover summary</button></section>
        </aside>
      </div>
    </div>
  )
}