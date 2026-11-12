import {
  Activity, Bot, CheckCheck, ChevronDown, CircleHelp, FileClock,
  FolderKanban, LayoutDashboard, Layers3, LogOut, MessageCircle, Plug,
  Settings, Sparkles, X,
} from 'lucide-react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const primaryLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/reviews', label: 'Review center', icon: CheckCheck, badge: '3' },
]
const workspaceLinks = [
  { to: '/ai-analysis', label: 'AI analysis', icon: Sparkles },
  { to: '/chatbot', label: 'Handover assistant', icon: MessageCircle },
  { to: '/integrations', label: 'Integrations', icon: Plug },
  { to: '/audit-logs', label: 'Activity log', icon: FileClock },
]

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  function closeMenu() {
    document.body.classList.remove('sidebar-open')
  }

  function logout() {
    signOut()
    closeMenu()
    navigate('/login')
  }

  return (
    <>
      <button className="sidebar-backdrop" type="button" aria-label="Close navigation" onClick={closeMenu} />
      <aside className="sidebar">
        <div className="sidebar-brand-row">
          <Link className="brand" to="/dashboard" onClick={closeMenu}>
            <span className="brand-mark"><Layers3 size={19} /></span>
            <span>handover<span className="brand-dot">.</span></span>
          </Link>
          <button className="icon-button sidebar-close" type="button" onClick={closeMenu} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <button className="workspace-picker" type="button">
          <span className="workspace-symbol">S</span>
          <span className="workspace-name"><strong>Studio North</strong><small>Free workspace</small></span>
          <ChevronDown size={15} />
        </button>
        <nav className="side-nav" aria-label="Workspace navigation">
          <span className="nav-section-label">WORKSPACE</span>
          {primaryLinks.map(({ to, label, icon: Icon, badge }) => (
            <NavLink key={to} to={to} onClick={closeMenu} className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>
              <Icon size={17} /><span>{label}</span>{badge && <span className="nav-count">{badge}</span>}
            </NavLink>
          ))}
          <span className="nav-section-label nav-section-spaced">TOOLS</span>
          {workspaceLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={closeMenu} className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>
              <Icon size={17} /><span>{label}</span>{to === '/ai-analysis' && <span className="new-pill">NEW</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link className="side-link" to="/settings" onClick={closeMenu}><Settings size={17} /><span>Settings</span></Link>
          <Link className="side-link" to="/chatbot" onClick={closeMenu}><CircleHelp size={17} /><span>Help & support</span></Link>
          <div className="sidebar-divider" />
          <div className="sidebar-user">
            <span className="avatar">{user?.name?.slice(0, 1).toUpperCase() || 'U'}</span>
            <span className="sidebar-user-copy"><strong>{user?.name || 'Your account'}</strong><small>{user?.email || 'Workspace member'}</small></span>
            <button type="button" className="icon-button logout-button" title="Sign out" aria-label="Sign out" onClick={logout}><LogOut size={16} /></button>
          </div>
        </div>
        <div className="sidebar-footnote"><Activity size={13} /> All systems operational</div>
        <span className="sr-only"><Bot /></span>
      </aside>
    </>
  )
}