import { Link } from 'react-router-dom'
import { ArrowLeft, Layers3 } from 'lucide-react'

export default function AuthLayout({ children, title, description, footer }) {
  return (
    <main className="auth-page">
      <div className="auth-topbar">
        <Link className="brand brand-dark" to="/">
          <span className="brand-mark"><Layers3 size={19} /></span>
          <span>handover<span className="brand-dot">.</span></span>
        </Link>
        <Link className="text-link" to="/"><ArrowLeft size={15} /> Back to home</Link>
      </div>
      <section className="auth-card">
        <div className="auth-intro">
          <span className="eyebrow">YOUR PROJECT, READY FOR WHAT'S NEXT</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {children}
        {footer && <div className="auth-footer">{footer}</div>}
      </section>
      <p className="auth-legal">A calmer way to hand over great work.</p>
    </main>
  )
}