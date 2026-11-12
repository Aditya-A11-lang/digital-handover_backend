import { ArrowUpRight, CircleCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

export default function ProgressCard({ project }) {
  const total = project.checklist.length
  const done = project.checklist.filter((item) => item.done).length
  const progress = total ? Math.round((done / total) * 100) : 0
  return (
    <article className="progress-card">
      <div className="progress-card-heading">
        <div><h3>{project.name}</h3><span>{project.client}</span></div>
        <Link className="icon-button subtle-icon" to={`/projects/${project.id}`} aria-label={`Open ${project.name}`}><ArrowUpRight size={17} /></Link>
      </div>
      <div className="progress-card-meta"><StatusBadge status={project.status} /><span><CircleCheck size={14} /> {done} of {total} items</span></div>
      <ProgressBar value={progress} />
      <div className="progress-card-foot"><span>Handover progress</span><strong>{progress}%</strong></div>
    </article>
  )
}