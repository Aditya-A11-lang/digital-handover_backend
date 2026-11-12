import { useMemo } from 'react'
import { ArrowRight, CheckCheck, CircleCheck, FolderKanban, Plus, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import ProgressCard from './ProgressCard.jsx'
import { getAuditLogs, getProjects } from '../services/api.js'

function relativeDate(value) {
  const date = new Date(value)
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

export default function Dashboard() {
  const projects = useMemo(() => getProjects(), [])
  const activity = useMemo(() => getAuditLogs().slice(0, 4), [])
  const active = projects.filter((project) => project.status !== 'Completed')
  const tasks = projects.flatMap((project) => project.checklist)
  const complete = tasks.filter((task) => task.done).length
  const reviewCount = projects.filter((project) => project.status === 'Review').length

  return (
    <div className="page-wrap">
      <section className="welcome-banner">
        <div><span className="welcome-eyebrow"><Sparkles size={14} /> YOUR WORKSPACE AT A GLANCE</span><h2>Make room for what’s next.</h2><p>You’ve got {active.length} active projects and {tasks.length - complete} handover items to keep moving.</p></div>
        <Link className="button button-white" to="/projects/new"><Plus size={16} /> Start a project</Link>
        <span className="banner-decoration banner-circle-one" /><span className="banner-decoration banner-circle-two" />
      </section>
      <div className="stats-grid">
        <StatCard label="Total projects" value={projects.length} note="Across your workspace" change="+2 this month" icon={FolderKanban} />
        <StatCard label="In progress" value={active.length} note="Projects moving forward" tone="blue" icon={Sparkles} />
        <StatCard label="Ready for review" value={reviewCount} note="A final look goes a long way" tone="peach" icon={CheckCheck} />
        <StatCard label="Items completed" value={complete} note={`Out of ${tasks.length} checklist items`} tone="green" icon={CircleCheck} />
      </div>
      <div className="dashboard-columns">
        <section className="section-panel">
          <div className="panel-heading"><div><h2>Project progress</h2><p>A quick look at what your team is working on.</p></div><Link className="inline-link" to="/projects">All projects <ArrowRight size={15} /></Link></div>
          <div className="progress-card-list">{active.slice(0, 3).map((project) => <ProgressCard key={project.id} project={project} />)}</div>
        </section>
        <aside className="section-panel activity-panel">
          <div className="panel-heading"><div><h2>Recent activity</h2><p>The latest from your team.</p></div></div>
          <div className="activity-list">{activity.map((item, index) => <article className="activity-item" key={item.id}><span className={`activity-marker activity-marker-${index % 4}`}><CircleCheck size={14} /></span><div><p><strong>{item.actor}</strong> {item.action.toLowerCase()}</p><span>{item.detail}</span><small>{relativeDate(item.createdAt)}</small></div></article>)}</div>
          <Link className="activity-all" to="/audit-logs">View all activity <ArrowRight size={14} /></Link>
        </aside>
      </div>
      <section className="tip-banner"><span className="tip-icon"><Sparkles size={17} /></span><p><strong>A small nudge:</strong> Clear owners and next steps make all the difference in a great handover.</p><Link to="/ai-analysis">See your insights <ArrowRight size={14} /></Link></section>
    </div>
  )
}