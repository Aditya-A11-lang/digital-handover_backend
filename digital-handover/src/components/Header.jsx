import { Bell, Menu, Plus, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const titles = {
  '/dashboard': ['Overview', 'Here’s what’s happening across your projects.'],
  '/projects': ['Projects', 'Every project, and every detail, in one place.'],
  '/projects/new': ['New project', 'Set up the details for a smooth handover.'],
  '/reviews': ['Review center', 'See what needs a final review or sign-off.'],
  '/ai-analysis': ['AI analysis', 'A clearer picture of handover readiness.'],
  '/chatbot': ['Handover assistant', 'Ask a question about your project workspace.'],
  '/integrations': ['Integrations', 'Bring your team’s tools into the workflow.'],
  '/audit-logs': ['Activity log', 'A transparent record of recent changes.'],
  '/settings': ['Settings', 'Manage your personal workspace preferences.'],
}

export default function Header() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const [title, subtitle] = titles[pathname] || ['Project handover', 'Keep the next step moving.']

  function openMenu() {
    document.body.classList.toggle('sidebar-open')
  }

  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" type="button" aria-label="Toggle navigation" onClick={openMenu}><Menu size={19} /></button>
      <div className="topbar-heading">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-actions">
        <label className="search-box">
          <Search size={16} />
          <input aria-label="Search projects" placeholder="Search..." onKeyDown={(event) => {
            if (event.key === 'Enter' && event.currentTarget.value) window.location.href = `/projects?search=${encodeURIComponent(event.currentTarget.value)}`
          }} />
          <kbd>⌘ K</kbd>
        </label>
        <button className="icon-button notification-button" type="button" aria-label="Notifications"><Bell size={18} /><span /></button>
        <Link className="button button-primary topbar-create" to="/projects/new"><Plus size={16} /> New project</Link>
        <span className="avatar avatar-small">{user?.name?.slice(0, 1).toUpperCase() || 'U'}</span>
      </div>
    </header>
  )
}