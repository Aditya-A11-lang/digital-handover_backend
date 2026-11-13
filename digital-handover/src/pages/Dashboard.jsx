import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  CheckCheck,
  CircleCheck,
  Clock,
  FolderKanban,
  PieChart,
  Plus,
  Sparkles
} from 'lucide-react'
import AssistantQuestion from '../components/AssistantQuestion.jsx'

// Safe router link fallback for standalone preview & React Router apps
function Link({ to, className, children }) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault()
      }}
    >
      {children}
    </a>
  )
}

// Embedded workspace project & audit log data
function getProjects() {
  return [
    {
      id: 'proj-1',
      name: 'Cloud Migration Handover',
      owner: 'Aarav Patel',
      dueDate: 'Nov 18',
      status: 'In Progress',
      checklist: [
        { id: 't1', label: 'IAM roles audited', done: true },
        { id: 't2', label: 'Database failover drill', done: true },
        { id: 't3', label: 'Runbook sign-off', done: true },
        { id: 't4', label: 'DNS cutover checklist', done: false }
      ]
    },
    {
      id: 'proj-2',
      name: 'Customer Portal v3 Launch',
      owner: 'Meera Nair',
      dueDate: 'Nov 21',
      status: 'Review',
      checklist: [
        { id: 't5', label: 'Accessibility audit', done: true },
        { id: 't6', label: 'Release notes finalized', done: true },
        { id: 't7', label: 'Support team walkthrough', done: true },
        { id: 't8', label: 'Final QA sign-off', done: true }
      ]
    },
    {
      id: 'proj-3',
      name: 'Billing Engine Refactor',
      owner: 'Rohan Deshmukh',
      dueDate: 'Nov 26',
      status: 'In Progress',
      checklist: [
        { id: 't9', label: 'Webhook retry queue', done: true },
        { id: 't10', label: 'Invoice PDF templates', done: true },
        { id: 't11', label: 'Load testing report', done: false },
        { id: 't12', label: 'On-call escalation matrix', done: false },
        { id: 't13', label: 'Security review', done: false }
      ]
    },
    {
      id: 'proj-4',
      name: 'Q4 Security Compliance',
      owner: 'Ananya Verma',
      dueDate: 'Nov 10',
      status: 'Completed',
      checklist: [
        { id: 't14', label: 'SOC2 evidence archive', done: true },
        { id: 't15', label: 'Vendor risk register', done: true },
        { id: 't16', label: 'Executive attestation', done: true }
      ]
    }
  ]
}

function getAuditLogs() {
  const now = Date.now()
  return [
    {
      id: 'log-1',
      actor: 'Meera Nair',
      action: 'Moved project to Review',
      detail: 'Customer Portal v3 Launch · All 4 handover items complete',
      createdAt: new Date(now - 2 * 3600 * 1000).toISOString()
    },
    {
      id: 'log-2',
      actor: 'Aarav Patel',
      action: 'Completed handover task',
      detail: 'Runbook sign-off in Cloud Migration Handover',
      createdAt: new Date(now - 26 * 3600 * 1000).toISOString()
    },
    {
      id: 'log-3',
      actor: 'Rohan Deshmukh',
      action: 'Updated target milestone',
      detail: 'Billing Engine Refactor · Scheduled load testing',
      createdAt: new Date(now - 52 * 3600 * 1000).toISOString()
    },
    {
      id: 'log-4',
      actor: 'Ananya Verma',
      action: 'Closed handover package',
      detail: 'Q4 Security Compliance archived with full sign-off',
      createdAt: new Date(now - 76 * 3600 * 1000).toISOString()
    }
  ]
}

// Animated StatCard with smooth count-up transition
function StatCard({ label, value, change, note, icon: Icon, tone = 'indigo' }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const rawStr = String(value)
    const match = rawStr.match(/^([^\d.-]*)([\d.]+)(.*)$/)
    if (!match) {
      setDisplayValue(value)
      return
    }

    const [, prefix, numStr, suffix] = match
    const target = parseFloat(numStr)
    const isFloat = numStr.includes('.')
    const duration = 700
    let startTime = null
    let frameId

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = target * eased
      const formatted = isFloat ? current.toFixed(1) : Math.round(current)
      setDisplayValue(`${prefix}${formatted}${suffix}`)

      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      }
    }

    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [value])

  return (
    <article className={`stat-card stat-tone-${tone}`}>
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        {Icon && (
          <span className={`stat-icon-badge tone-${tone}`}>
            <Icon size={17} />
          </span>
        )}
      </div>
      <div className="stat-value-row">
        <strong className="stat-value">{displayValue}</strong>
        {change && <span className="stat-change">{change}</span>}
      </div>
      <p className="stat-note">{note}</p>
    </article>
  )
}

// Embedded ProgressCard preserving your exact props & visual hierarchy
function ProgressCard({ project, isSelected, onSelect }) {
  const total = project.checklist?.length || 0
  const done = project.checklist?.filter((item) => item.done).length || 0
  const percent = total > 0 ? Math.round((done / total) * 100) : 0
  const isReview = project.status === 'Review'

  return (
    <article
      className={`progress-card ${isSelected ? 'is-selected' : ''}`}
      onClick={() => onSelect && onSelect(project.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect && onSelect(project.id)
        }
      }}
    >
      <div className="progress-card-header">
        <div>
          <h3>{project.name}</h3>
          <span className="progress-meta">
            Owner: {project.owner} · Due {project.dueDate}
          </span>
        </div>
        <span className={`status-pill ${isReview ? 'status-review' : 'status-active'}`}>
          {project.status}
        </span>
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="progress-percent">
          {done}/{total} ({percent}%)
        </span>
      </div>
    </article>
  )
}

// Interactive Analytics Section with Growing Bar Chart & Animated Donut Chart
function WorkspaceCharts({ projects, selectedProjectId, onSelectProject }) {
  const [mounted, setMounted] = useState(false)
  const [hoveredBar, setHoveredBar] = useState(null)
  const [hoveredStatus, setHoveredStatus] = useState(null)

  useEffect(() => {
    const timer = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(timer)
  }, [])

  const barData = useMemo(() => {
    return projects.map((proj) => {
      const total = proj.checklist?.length || 0
      const done = proj.checklist?.filter((t) => t.done).length || 0
      const percent = total > 0 ? Math.round((done / total) * 100) : 0
      return {
        id: proj.id,
        name: proj.name,
        shortName: proj.name.split(' ').slice(0, 2).join(' '),
        owner: proj.owner,
        status: proj.status,
        done,
        total,
        percent
      }
    })
  }, [projects])

  const statusData = useMemo(() => {
    const inProgress = projects.filter((p) => p.status === 'In Progress').length
    const review = projects.filter((p) => p.status === 'Review').length
    const completed = projects.filter((p) => p.status === 'Completed').length
    const total = Math.max(projects.length, 1)

    return [
      { key: 'In Progress', count: inProgress, color: '#4f46e5', bg: '#eef2ff', pct: Math.round((inProgress / total) * 100) },
      { key: 'Review', count: review, color: '#f97316', bg: '#fff7ed', pct: Math.round((review / total) * 100) },
      { key: 'Completed', count: completed, color: '#10b981', bg: '#ecfdf5', pct: Math.round((completed / total) * 100) }
    ]
  }, [projects])

  const radius = 52
  const circumference = 2 * Math.PI * radius
  let cumulativePercent = 0

  return (
    <div className="analytics-grid anim-enter" style={{ animationDelay: '260ms' }}>
      {/* Growing Project Completion Bar Chart */}
      <section className="section-panel chart-panel">
        <div className="panel-heading">
          <div>
            <h2 className="chart-title-row">
              <BarChart3 size={18} className="chart-heading-icon" /> Project completion velocity
            </h2>
            <p>Click or hover any project bar to inspect checklist progress.</p>
          </div>
          <span className="chart-live-badge">
            <span className="pulse-dot" /> Live metrics
          </span>
        </div>

        <div className="bar-chart-stage">
          <div className="bar-grid-lines">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>

          <div className="bars-container">
            {barData.map((item, idx) => {
              const isHighlighted = hoveredBar === item.id || selectedProjectId === item.id
              return (
                <div
                  key={item.id}
                  className={`bar-column ${isHighlighted ? 'is-active' : ''}`}
                  onMouseEnter={() => setHoveredBar(item.id)}
                  onMouseLeave={() => setHoveredBar(null)}
                  onClick={() => onSelectProject && onSelectProject(item.id === selectedProjectId ? null : item.id)}
                >
                  <div className={`bar-tooltip ${isHighlighted ? 'visible' : ''}`}>
                    <strong>{item.name}</strong>
                    <span>
                      {item.done}/{item.total} tasks · {item.percent}%
                    </span>
                  </div>

                  <div className="bar-track-vertical">
                    <div
                      className={`bar-fill-vertical status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}
                      style={{
                        height: mounted ? `${Math.max(item.percent, 8)}%` : '0%',
                        transitionDelay: `${idx * 110 + 150}ms`
                      }}
                    >
                      <span className="bar-value-tag">{item.percent}%</span>
                    </div>
                  </div>
                  <span className="bar-x-label" title={item.name}>
                    {item.shortName}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interactive Status Donut Chart */}
      <section className="section-panel chart-panel">
        <div className="panel-heading">
          <div>
            <h2 className="chart-title-row">
              <PieChart size={18} className="chart-heading-icon" /> Handover status split
            </h2>
            <p>Hover a segment to highlight stage counts.</p>
          </div>
        </div>

        <div className="donut-layout">
          <div className="donut-svg-wrap">
            <svg viewBox="0 0 140 140" className="donut-svg">
              <circle cx="70" cy="70" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="16" />
              {statusData.map((seg, idx) => {
                const segmentLength = (seg.pct / 100) * circumference
                const dashOffset = -((cumulativePercent / 100) * circumference)
                cumulativePercent += seg.pct
                const isActive = hoveredStatus === seg.key

                return (
                  <circle
                    key={seg.key}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={isActive ? '19' : '16'}
                    strokeLinecap="round"
                    strokeDasharray={mounted ? `${Math.max(segmentLength - 4, 0)} ${circumference}` : `0 ${circumference}`}
                    strokeDashoffset={dashOffset}
                    transform="rotate(-90 70 70)"
                    style={{
                      transition: `stroke-dasharray 0.95s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 140 + 200}ms, stroke-width 0.22s ease, opacity 0.22s ease`,
                      opacity: hoveredStatus && !isActive ? 0.45 : 1,
                      cursor: 'pointer'
                    }}
                    onMouseEnter={() => setHoveredStatus(seg.key)}
                    onMouseLeave={() => setHoveredStatus(null)}
                  />
                )
              })}
            </svg>
            <div className="donut-center-label">
              <strong>
                {hoveredStatus
                  ? statusData.find((s) => s.key === hoveredStatus)?.count
                  : projects.length}
              </strong>
              <span>{hoveredStatus || 'Projects'}</span>
            </div>
          </div>

          <div className="donut-legend">
            {statusData.map((seg) => {
              const isActive = hoveredStatus === seg.key
              return (
                <div
                  key={seg.key}
                  className={`legend-row ${isActive ? 'is-active' : ''}`}
                  onMouseEnter={() => setHoveredStatus(seg.key)}
                  onMouseLeave={() => setHoveredStatus(null)}
                >
                  <span className="legend-dot" style={{ backgroundColor: seg.color }} />
                  <span className="legend-name">{seg.key}</span>
                  <span className="legend-count" style={{ backgroundColor: seg.bg, color: seg.color }}>
                    {seg.count} ({seg.pct}%)
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

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
  const [selectedProjectId, setSelectedProjectId] = useState(null)

  const active = projects.filter((project) => project.status !== 'Completed')
  const tasks = projects.flatMap((project) => project.checklist)
  const complete = tasks.filter((task) => task.done).length
  const reviewCount = projects.filter((project) => project.status === 'Review').length
  const completionRate = tasks.length > 0 ? Math.round((complete / tasks.length) * 100) : 0

  return (
    <div className="page-wrap dashboard-animated">
      <style>{`
        @keyframes dashFadeUp {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.985);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes dashFloatOne {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-16px, -20px) scale(1.08);
          }
        }

        @keyframes dashFloatTwo {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(18px, 16px) scale(1.1);
          }
        }

        @keyframes dashShimmer {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(220%);
          }
        }

        @keyframes livePulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.45);
            opacity: 0.45;
          }
        }

        @keyframes badgeWiggle {
          0%, 100% {
            transform: rotate(0deg) scale(1);
          }
          35% {
            transform: rotate(-10deg) scale(1.12);
          }
          70% {
            transform: rotate(8deg) scale(1.12);
          }
        }

        .page-wrap.dashboard-animated {
          max-width: 1200px;
          margin: 0 auto;
          padding: 28px 24px 48px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #0f172a;
          background: #f8fafc;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .dashboard-animated .anim-enter {
          opacity: 0;
          animation: dashFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Hero Banner */
        .dashboard-animated .welcome-banner {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          padding: 32px 36px;
          color: #ffffff;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: linear-gradient(135deg, #4f46e5 0%, #6d28d9 52%, #7c3aed 100%);
          box-shadow: 0 18px 36px -12px rgba(79, 70, 229, 0.28);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .dashboard-animated .welcome-banner:hover {
          box-shadow: 0 22px 42px -12px rgba(79, 70, 229, 0.36);
        }

        .dashboard-animated .welcome-banner > div {
          position: relative;
          z-index: 2;
          max-width: 600px;
        }

        .dashboard-animated .welcome-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 11px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(8px);
          margin-bottom: 12px;
        }

        .dashboard-animated .welcome-banner h2 {
          margin: 0 0 8px;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .dashboard-animated .welcome-banner p {
          margin: 0;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.88);
          line-height: 1.5;
        }

        .dashboard-animated .banner-decoration {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        }

        .dashboard-animated .banner-circle-one {
          width: 240px;
          height: 240px;
          right: -40px;
          top: -70px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, transparent 70%);
          animation: dashFloatOne 9s ease-in-out infinite;
        }

        .dashboard-animated .banner-circle-two {
          width: 180px;
          height: 180px;
          right: 180px;
          bottom: -80px;
          background: radial-gradient(circle, rgba(196, 181, 253, 0.25) 0%, transparent 70%);
          animation: dashFloatTwo 11s ease-in-out infinite;
        }

        /* Primary CTA Button */
        .dashboard-animated .button-white {
          position: relative;
          z-index: 2;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 12px;
          background: #ffffff;
          color: #4338ca;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease;
        }

        .dashboard-animated .button-white:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 22px -6px rgba(15, 23, 42, 0.25);
        }

        .dashboard-animated .button-white:active {
          transform: translateY(0);
        }

        .dashboard-animated .button-white::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 45%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent);
          transform: translateX(-120%);
        }

        .dashboard-animated .button-white:hover::after {
          animation: dashShimmer 0.8s ease-in-out;
        }

        /* Stats Grid & StatCard */
        .dashboard-animated .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .dashboard-animated .stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
        }

        .dashboard-animated .stats-grid > * {
          opacity: 0;
          animation: dashFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease, border-color 0.28s ease;
        }

        .dashboard-animated .stats-grid > *:nth-child(1) { animation-delay: 70ms; }
        .dashboard-animated .stats-grid > *:nth-child(2) { animation-delay: 130ms; }
        .dashboard-animated .stats-grid > *:nth-child(3) { animation-delay: 190ms; }
        .dashboard-animated .stats-grid > *:nth-child(4) { animation-delay: 250ms; }

        .dashboard-animated .stats-grid > *:hover {
          transform: translateY(-5px);
          border-color: #c7d2fe;
          box-shadow: 0 16px 32px -10px rgba(79, 70, 229, 0.14);
        }

        .dashboard-animated .stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .dashboard-animated .stat-label {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
        }

        .dashboard-animated .stat-icon-badge {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #eef2ff;
          color: #4f46e5;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .dashboard-animated .stat-card:hover .stat-icon-badge {
          animation: badgeWiggle 0.55s ease;
        }

        .dashboard-animated .stat-icon-badge.tone-blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .dashboard-animated .stat-icon-badge.tone-peach {
          background: #fff7ed;
          color: #ea580c;
        }

        .dashboard-animated .stat-icon-badge.tone-green {
          background: #ecfdf5;
          color: #059669;
        }

        .dashboard-animated .stat-value-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 4px;
        }

        .dashboard-animated .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .dashboard-animated .stat-change {
          font-size: 12px;
          font-weight: 600;
          color: #059669;
          background: #ecfdf5;
          padding: 2px 8px;
          border-radius: 999px;
        }

        .dashboard-animated .stat-note {
          margin: 0;
          font-size: 13px;
          color: #64748b;
        }

        /* Interactive Analytics Charts */
        .dashboard-animated .analytics-grid {
          display: grid;
          grid-template-columns: 1.45fr 1fr;
          gap: 20px;
        }

        @media (max-width: 900px) {
          .dashboard-animated .analytics-grid {
            grid-template-columns: 1fr;
          }
        }

        .dashboard-animated .chart-title-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 4px;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .dashboard-animated .chart-heading-icon {
          color: #4f46e5;
        }

        .dashboard-animated .chart-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 600;
          color: #059669;
          background: #ecfdf5;
          padding: 4px 10px;
          border-radius: 999px;
          white-space: nowrap;
        }

        .dashboard-animated .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          animation: livePulse 1.8s ease-in-out infinite;
        }

        .dashboard-animated .bar-chart-stage {
          position: relative;
          height: 210px;
          display: flex;
          align-items: flex-end;
          padding-top: 28px;
          padding-left: 38px;
        }

        .dashboard-animated .bar-grid-lines {
          position: absolute;
          inset: 28px 0 28px 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          pointer-events: none;
        }

        .dashboard-animated .bar-grid-lines span {
          font-size: 10.5px;
          color: #94a3b8;
          border-bottom: 1px dashed #e2e8f0;
          line-height: 1;
          padding-bottom: 3px;
        }

        .dashboard-animated .bars-container {
          position: relative;
          z-index: 2;
          flex: 1;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          align-items: flex-end;
        }

        .dashboard-animated .bar-column {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          position: relative;
          cursor: pointer;
        }

        .dashboard-animated .bar-tooltip {
          position: absolute;
          top: -34px;
          background: #0f172a;
          color: #ffffff;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 11px;
          white-space: nowrap;
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0;
          transform: translateY(6px) scale(0.95);
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.2);
          z-index: 10;
        }

        .dashboard-animated .bar-tooltip span {
          color: #cbd5e1;
          font-size: 10px;
        }

        .dashboard-animated .bar-tooltip.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .dashboard-animated .bar-track-vertical {
          width: 100%;
          max-width: 48px;
          height: calc(100% - 28px);
          background: #f1f5f9;
          border-radius: 12px 12px 6px 6px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          padding: 3px;
          transition: background-color 0.2s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .dashboard-animated .bar-column:hover .bar-track-vertical,
        .dashboard-animated .bar-column.is-active .bar-track-vertical {
          background: #e0e7ff;
          transform: translateY(-3px);
        }

        .dashboard-animated .bar-fill-vertical {
          width: 100%;
          border-radius: 9px 9px 4px 4px;
          background: linear-gradient(180deg, #6366f1 0%, #4338ca 100%);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 6px;
          transition: height 0.95s cubic-bezier(0.16, 1, 0.3, 1), filter 0.2s ease;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
        }

        .dashboard-animated .bar-fill-vertical.status-review {
          background: linear-gradient(180deg, #fb923c 0%, #ea580c 100%);
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25);
        }

        .dashboard-animated .bar-fill-vertical.status-completed {
          background: linear-gradient(180deg, #34d399 0%, #059669 100%);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);
        }

        .dashboard-animated .bar-column:hover .bar-fill-vertical,
        .dashboard-animated .bar-column.is-active .bar-fill-vertical {
          filter: brightness(1.08);
        }

        .dashboard-animated .bar-value-tag {
          font-size: 10.5px;
          font-weight: 700;
          color: #ffffff;
        }

        .dashboard-animated .bar-x-label {
          margin-top: 8px;
          font-size: 11.5px;
          font-weight: 600;
          color: #475569;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90px;
        }

        .dashboard-animated .bar-column.is-active .bar-x-label {
          color: #4f46e5;
        }

        /* Donut Chart */
        .dashboard-animated .donut-layout {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .dashboard-animated .donut-svg-wrap {
          position: relative;
          width: 140px;
          height: 140px;
          margin: 0 auto;
        }

        .dashboard-animated .donut-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .dashboard-animated .donut-center-label {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .dashboard-animated .donut-center-label strong {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.1;
        }

        .dashboard-animated .donut-center-label span {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
        }

        .dashboard-animated .donut-legend {
          flex: 1;
          min-width: 165px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .dashboard-animated .legend-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          border-radius: 10px;
          background: #f8fafc;
          cursor: pointer;
          transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .dashboard-animated .legend-row:hover,
        .dashboard-animated .legend-row.is-active {
          background: #f1f5f9;
          transform: translateX(4px);
        }

        .dashboard-animated .legend-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .dashboard-animated .legend-name {
          flex: 1;
          font-size: 12.5px;
          font-weight: 600;
          color: #334155;
        }

        .dashboard-animated .legend-count {
          font-size: 11.5px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
        }

        /* Two-Column Workspace */
        .dashboard-animated .dashboard-columns {
          display: grid;
          grid-template-columns: 1.45fr 1fr;
          gap: 20px;
        }

        @media (max-width: 900px) {
          .dashboard-animated .dashboard-columns {
            grid-template-columns: 1fr;
          }
        }

        .dashboard-animated .section-panel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .dashboard-animated .section-panel:hover {
          box-shadow: 0 14px 32px -12px rgba(15, 23, 42, 0.08);
        }

        .dashboard-animated .panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .dashboard-animated .panel-heading h2 {
          margin: 0 0 4px;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .dashboard-animated .panel-heading p {
          margin: 0;
          font-size: 13px;
          color: #64748b;
        }

        .dashboard-animated .panel-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          color: #4f46e5;
          text-decoration: none;
          white-space: nowrap;
        }

        .dashboard-animated .panel-link:hover {
          text-decoration: underline;
        }

        /* Progress Cards List */
        .dashboard-animated .cards-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dashboard-animated .progress-card {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px;
          background: #ffffff;
          cursor: pointer;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
        }

        .dashboard-animated .progress-card:hover {
          border-color: #c7d2fe;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -8px rgba(79, 70, 229, 0.14);
        }

        .dashboard-animated .progress-card.is-selected {
          border-color: #4f46e5;
          background: #f5f3ff;
        }

        .dashboard-animated .progress-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .dashboard-animated .progress-card-header h3 {
          margin: 0 0 3px;
          font-size: 14.5px;
          font-weight: 600;
          color: #0f172a;
        }

        .dashboard-animated .progress-meta {
          font-size: 12px;
          color: #64748b;
        }

        .dashboard-animated .status-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          white-space: nowrap;
        }

        .dashboard-animated .status-active {
          background: #eef2ff;
          color: #4f46e5;
        }

        .dashboard-animated .status-review {
          background: #fff7ed;
          color: #ea580c;
        }

        .dashboard-animated .progress-bar-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dashboard-animated .progress-bar-track {
          flex: 1;
          height: 8px;
          background: #f1f5f9;
          border-radius: 999px;
          overflow: hidden;
        }

        .dashboard-animated .progress-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #4f46e5, #7c3aed);
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dashboard-animated .progress-percent {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          min-width: 68px;
          text-align: right;
        }

        /* Audit Activity Feed */
        .dashboard-animated .activity-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .dashboard-animated .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding-bottom: 14px;
          border-bottom: 1px solid #f1f5f9;
        }

        .dashboard-animated .activity-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .dashboard-animated .activity-avatar {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dashboard-animated .activity-body {
          flex: 1;
          min-width: 0;
        }

        .dashboard-animated .activity-title {
          margin: 0 0 2px;
          font-size: 13px;
          color: #0f172a;
          line-height: 1.4;
        }

        .dashboard-animated .activity-detail {
          margin: 0 0 4px;
          font-size: 12px;
          color: #64748b;
        }

        .dashboard-animated .activity-time {
          font-size: 11px;
          font-weight: 500;
          color: #94a3b8;
        }
      `}</style>

      {/* Hero Welcome Banner */}
      <header className="welcome-banner anim-enter" style={{ animationDelay: '0ms' }}>
        <div>
          <span className="welcome-eyebrow">
            <Sparkles size={13} /> Handover Command Center
          </span>
          <h2>Welcome back to your workspace</h2>
          <p>
            Track active transition checklists, sign-off readiness, and audit logs across your engineering teams.
          </p>
        </div>

        <Link to="/projects/new" className="button-white">
          <Plus size={16} /> New handover package
        </Link>

        <span className="banner-decoration banner-circle-one" />
        <span className="banner-decoration banner-circle-two" />
      </header>

      {/* Top KPI Stats */}
      <section className="stats-grid" aria-label="Workspace summary metrics">
        <StatCard
          label="Active Handovers"
          value={active.length}
          change="+2 this week"
          note="Across 3 engineering squads"
          icon={FolderKanban}
          tone="blue"
        />
        <StatCard
          label="Ready for Review"
          value={reviewCount}
          note="Awaiting stakeholder sign-off"
          icon={Clock}
          tone="peach"
        />
        <StatCard
          label="Tasks Completed"
          value={`${complete}/${tasks.length}`}
          change={`${completionRate}%`}
          note="Checklist verification rate"
          icon={CheckCheck}
          tone="green"
        />
        <StatCard
          label="Closed Packages"
          value={projects.length - active.length}
          note="Archived with full audit trail"
          icon={CircleCheck}
          tone="indigo"
        />
      </section>

      <AssistantQuestion projects={projects} />

      {/* Interactive Analytics Charts */}
      <WorkspaceCharts
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
      />

      {/* Bottom Two-Column Workspace */}
      <div className="dashboard-columns anim-enter" style={{ animationDelay: '340ms' }}>
        {/* Active Handover Progress Cards */}
        <section className="section-panel">
          <div>
            <div className="panel-heading">
              <div>
                <h2>Active handover packages</h2>
                <p>Click a package to highlight it in the velocity chart above.</p>
              </div>
              <Link to="/projects" className="panel-link">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="cards-stack">
              {active.map((project) => (
                <ProgressCard
                  key={project.id}
                  project={project}
                  isSelected={selectedProjectId === project.id}
                  onSelect={(id) => setSelectedProjectId(id === selectedProjectId ? null : id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Recent Audit Activity */}
        <section className="section-panel">
          <div>
            <div className="panel-heading">
              <div>
                <h2>Recent audit trail</h2>
                <p>Latest sign-offs and milestone updates.</p>
              </div>
              <Link to="/audit" className="panel-link">
                Full log <ArrowRight size={14} />
              </Link>
            </div>

            <div className="activity-list">
              {activity.map((item) => {
                const initials = item.actor
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)

                return (
                  <div key={item.id} className="activity-item">
                    <div className="activity-avatar">{initials}</div>
                    <div className="activity-body">
                      <p className="activity-title">
                        <strong>{item.actor}</strong> · {item.action}
                      </p>
                      <p className="activity-detail">{item.detail}</p>
                      <span className="activity-time">{relativeDate(item.createdAt)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}