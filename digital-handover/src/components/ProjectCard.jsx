import { ArrowUpRight, CalendarDays, CircleCheck, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProgressBar from './ProgressBar.jsx'
import StatusBadge from './StatusBadge.jsx'

export default function ProjectCard({ project }) {
  const count = project.checklist.filter((item) => item.done).length
  const progress = project.checklist.length ? Math.round((count / project.checklist.length) * 100) : 0
  return (
    <article className="project-card">
      <div className="project-card-top">
        <span className={`project-emblem emblem-${project.color}`}>{project.name.slice(0, 1)}</span>
        <Link className="icon-button subtle-icon" to={`/projects/${project.id}`} aria-label={`Open ${project.name}`}><ArrowUpRight size={17} /></Link>
      </div>
      <div className="project-card-title"><h3>{project.name}</h3><p>{project.client}</p></div>
      <p className="project-card-description">{project.description}</p>
      <div className="project-card-details">
        <StatusBadge status={project.status} />
        <span><CalendarDays size={14} />{new Date(`${project.dueDate}T12:00:00`).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
        <span><UserRound size={14} />{project.owner}</span>
      </div>
      <div className="project-progress-heading"><span><CircleCheck size={14} /> Handover checklist</span><strong>{progress}%</strong></div>
      <ProgressBar value={progress} compact />
      <div className="project-card-bottom"><span>{count} of {project.checklist.length} items complete</span><Link to={`/projects/${project.id}`}>View handover <ArrowUpRight size={14} /></Link></div>
    </article>
  )
}