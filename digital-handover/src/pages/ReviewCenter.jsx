import { useMemo } from 'react'
import { ArrowRight, CheckCheck, CircleAlert, Clock3, FileCheck2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge.jsx'
import { getProjects } from '../services/api.js'

export default function ReviewCenter() {
  const projects = useMemo(() => getProjects(), [])
  const needsReview = projects.filter((project) => project.status === 'Review' || project.status === 'In progress')
  const ready = needsReview.filter((project) => project.checklist.filter((item) => item.done).length / project.checklist.length >= 0.6)
  return (
    <div className="page-wrap">
      <section className="review-summary"><span className="review-summary-icon"><FileCheck2 size={21} /></span><div><span className="eyebrow">KEEP THE LAST MILE MOVING</span><h2>{ready.length} project{ready.length === 1 ? '' : 's'} ready for a closer look</h2><p>Check that owners, context, and next steps are all in good shape before sign-off.</p></div></section>
      <div className="review-stat-row"><span><CircleAlert size={16} /> {needsReview.length} open handovers</span><span><Clock3 size={16} /> {needsReview.reduce((sum, project) => sum + project.checklist.filter((item) => !item.done).length, 0)} checklist items to finish</span></div>
      <div className="review-list">{needsReview.length ? needsReview.map((project) => {
        const done = project.checklist.filter((item) => item.done).length
        const percent = project.checklist.length ? Math.round(done / project.checklist.length * 100) : 0
        return <article className="review-row" key={project.id}><span className={`project-emblem emblem-${project.color}`}>{project.name.slice(0, 1)}</span><div className="review-project"><h3>{project.name}</h3><p>{project.client}</p></div><StatusBadge status={project.status} /><div className="review-progress"><span>{done}/{project.checklist.length} ready</span><div><i style={{ width: `${percent}%` }} /></div></div><Link className="button button-quiet" to={`/projects/${project.id}`}>Review handover <ArrowRight size={14} /></Link></article>
      }) : <div className="empty-state"><span className="empty-state-icon"><CheckCheck size={24} /></span><h2>All caught up</h2><p>There are no handovers waiting for review.</p></div>}</div>
      <section className="tip-banner"><span className="tip-icon"><Sparkles size={17} /></span><p><strong>What makes a great review?</strong> Look for a clear project story, documented access, and named owners for next steps.</p><Link to="/verification">Final check <ArrowRight size={14} /></Link></section>
    </div>
  )
}