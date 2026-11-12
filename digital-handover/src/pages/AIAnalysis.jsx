import { useMemo } from 'react'
import { ArrowRight, CheckCircle2, CircleAlert, Lightbulb, Sparkles, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getProjects } from '../services/api.js'

export default function AIAnalysis() {
  const projects = useMemo(() => getProjects(), [])
  const taskCount = projects.reduce((total, project) => total + project.checklist.length, 0)
  const completed = projects.reduce((total, project) => total + project.checklist.filter((item) => item.done).length, 0)
  const openTasks = projects.flatMap((project) => project.checklist.filter((item) => !item.done).map((task) => ({ ...task, project })))
  const completion = taskCount ? Math.round(completed / taskCount * 100) : 0
  const priorities = openTasks.slice(0, 3)

  return (
    <div className="page-wrap">
      <section className="analysis-hero"><span className="analysis-icon"><Sparkles size={20} /></span><div><span className="eyebrow">WORKSPACE READINESS</span><h2>Your handover snapshot</h2><p>A practical overview based on the checklist progress in your workspace.</p></div><span className="analysis-score">{completion}<small>% complete</small></span></section>
      <div className="analysis-metrics"><article><span><TrendingUp size={17} /></span><div><strong>{completion}%</strong><small>Overall checklist completion</small></div></article><article><span><CheckCircle2 size={17} /></span><div><strong>{completed} of {taskCount}</strong><small>Handover items completed</small></div></article><article><span><CircleAlert size={17} /></span><div><strong>{openTasks.length}</strong><small>Items still to review</small></div></article></div>
      <div className="analysis-content-grid">
        <section className="section-panel"><div className="panel-heading"><div><h2>Suggested next steps</h2><p>Start with these open checklist items.</p></div><span className="insight-pill"><Sparkles size={13} /> INSIGHTS</span></div>
          {priorities.length ? <div className="priority-list">{priorities.map(({ id, title, owner, project }) => <article className="priority-item" key={`${project.id}-${id}`}><span className="priority-indicator" /><div><strong>{title}</strong><p>{project.name} · Owner: {owner}</p></div><Link to={`/projects/${project.id}`} aria-label={`Review ${title}`}><ArrowRight size={16} /></Link></article>)}</div> : <div className="analysis-complete"><CheckCircle2 size={20} /><span><strong>Nothing outstanding.</strong> Every project checklist is complete.</span></div>}
        </section>
        <aside className="insight-card"><span className="insight-card-icon"><Lightbulb size={18} /></span><span className="eyebrow">A THOUGHTFUL REMINDER</span><h3>The details make the difference.</h3><p>Teams tend to move faster when access instructions, open decisions, and a clear point of contact are easy to find.</p><Link to="/reviews">Visit review center <ArrowRight size={14} /></Link></aside>
      </div>
      <p className="demo-disclaimer">These workspace insights are calculated from your checklist data. No external AI service is connected in this demo.</p>
    </div>
  )
}