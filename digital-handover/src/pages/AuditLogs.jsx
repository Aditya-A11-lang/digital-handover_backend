import { useMemo } from 'react'
import { Activity, ArrowUpRight, CircleCheck, FileClock, FolderPlus, LogIn, Settings2 } from 'lucide-react'
import { getAuditLogs } from '../services/api.js'

const icons = {
  'Project created': FolderPlus,
  'Project updated': Settings2,
  'Signed in': LogIn,
  'Signed out': LogIn,
}

export default function AuditLogs() {
  const logs = useMemo(() => getAuditLogs(), [])
  return (
    <div className="page-wrap">
      <section className="audit-intro"><span className="audit-intro-icon"><Activity size={20} /></span><div><h2>Good work leaves a trail.</h2><p>See who changed what and when across your handover workspace.</p></div><span className="audit-total">{logs.length} events</span></section>
      <section className="section-panel audit-panel"><div className="panel-heading"><div><h2>All activity</h2><p>Your most recent workspace updates.</p></div><span className="audit-filter-label"><FileClock size={14} /> Latest first</span></div>
        <div className="audit-list">{logs.length ? logs.map((log) => {
          const Icon = icons[log.action] || CircleCheck
          return <article className="audit-row" key={log.id}><span className="audit-event-icon"><Icon size={16} /></span><div className="audit-event-copy"><p><strong>{log.actor}</strong> {log.action.toLowerCase()}</p><span>{log.detail}</span></div><time dateTime={log.createdAt}>{new Date(log.createdAt).toLocaleString('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</time><ArrowUpRight className="audit-row-arrow" size={15} /></article>
        }) : <div className="empty-state"><p>No activity yet. Updates will appear here.</p></div>}</div>
      </section>
      <p className="demo-disclaimer">Activity is stored locally in this browser and is only visible in this demo workspace.</p>
    </div>
  )
}