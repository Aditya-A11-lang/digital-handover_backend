import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

export default function StatCard({ label, value, note, change, tone = 'violet', icon: Icon }) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span className={`stat-icon stat-icon-${tone}`}><Icon size={18} /></span>
        {change && <span className={`stat-change${change.startsWith('-') ? ' negative' : ''}`}>{change.startsWith('-') ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{change}</span>}
      </div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-label">{label}</span>
      {note && <span className="stat-note">{note}</span>}
    </article>
  )
}