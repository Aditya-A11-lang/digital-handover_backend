import { ArrowRight, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="landing-nav">
      <Link className="brand brand-dark" to="/">
        <span className="brand-mark"><Layers3 size={19} /></span>
        <span>handover<span className="brand-dot">.</span></span>
      </Link>
      <nav aria-label="Main navigation">
        <a href="#how-it-works">How it works</a>
        <a href="#features">Features</a>
      </nav>
      <div className="landing-nav-actions">
        <Link className="nav-login" to="/login">Log in</Link>
        <Link className="button button-primary" to="/signup">Get started <ArrowRight size={15} /></Link>
      </div>
    </header>
  )
}