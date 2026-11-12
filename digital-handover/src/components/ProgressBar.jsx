export default function ProgressBar({ value = 0, compact = false }) {
  const percentage = Math.min(100, Math.max(0, Number(value) || 0))
  return (
    <div className={`progress-track${compact ? ' progress-compact' : ''}`} role="progressbar" aria-label="Handover completion" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
      <span className="progress-fill" style={{ width: `${percentage}%` }} />
    </div>
  )
}