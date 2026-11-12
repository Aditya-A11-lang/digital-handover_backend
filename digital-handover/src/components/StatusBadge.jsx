const statusClass = {
  'In progress': 'status-progress',
  Planning: 'status-planning',
  Review: 'status-review',
  Completed: 'status-completed',
  'Needs attention': 'status-attention',
}

export default function StatusBadge({ status }) {
  return <span className={`status-badge ${statusClass[status] || 'status-planning'}`}><span className="status-dot" />{status}</span>
}