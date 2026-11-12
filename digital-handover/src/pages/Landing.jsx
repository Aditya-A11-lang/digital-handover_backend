import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, CircleCheck, Layers3, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

const steps = [
  ['01', 'Bring it all together', 'Keep project docs, decisions, access, and next steps in one clear place.'],
  ['02', 'Make progress visible', 'A shared checklist makes ownership and handover readiness easy to see.'],
  ['03', 'Pass it on with confidence', 'Give the next team a thoughtful, complete picture from day one.'],
]

export default function Landing() {
  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <section className="landing-hero">
          <div className="hero-copy">
            <span className="hero-kicker"><span className="kicker-spark"><Sparkles size={13} /></span> THE LAST MILE, MADE SIMPLE</span>
            <h1>Good work deserves a <span>great handover.</span></h1>
            <p className="hero-description">Bring every project detail together, keep everyone in the loop, and make what happens next feel effortless.</p>
            <div className="hero-actions"><Link className="button button-primary button-large" to="/signup">Start your free workspace <ArrowRight size={17} /></Link><a className="hero-secondary" href="#how-it-works">See how it works <ArrowDown size={15} /></a></div>
            <div className="hero-proof"><div className="avatar-stack"><span className="avatar avatar-peach">J</span><span className="avatar avatar-lavender">M</span><span className="avatar avatar-mint">A</span><span className="avatar avatar-blue">S</span></div><span><strong>Made for teams that care</strong><small>Thoughtful handovers start here</small></span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
            <div className="mock-window">
              <div className="mock-top"><span className="mock-dots"><i /><i /><i /></span><span>Northstar Commerce</span><span className="mock-share">● Shared</span></div>
              <div className="mock-content">
                <div className="mock-project-heading"><span className="project-emblem emblem-violet">N</span><div><strong>Northstar Commerce</strong><small>Project handover</small></div><span className="mock-percent">72%</span></div>
                <div className="mock-progress"><span /></div>
                <div className="mock-label-row"><span>HANDOVER CHECKLIST</span><span>4 of 6 complete</span></div>
                <div className="mock-task done"><span><Check size={12} /></span><span>Project scope & success metrics</span><small>Olivia</small></div>
                <div className="mock-task done"><span><Check size={12} /></span><span>Architecture overview</span><small>Marcus</small></div>
                <div className="mock-task"><span /><span>Known issues & decisions</span><small>Olivia</small></div>
                <div className="mock-task"><span /><span>Final client walkthrough</span><small>Jamie</small></div>
                <div className="mock-ai-note"><Sparkles size={14} /><span><strong>Looking good!</strong> Just 2 items left before sign-off.</span></div>
              </div>
            </div>
            <div className="floating-note"><span className="floating-check"><CircleCheck size={17} /></span><span><strong>Handover complete</strong><small>Everything in its right place</small></span><ArrowUpRight size={15} /></div>
            <div className="hero-scribble">a better way to wrap up <ChevronRight size={14} /></div>
          </div>
        </section>
        <section className="trust-row"><span>LESS CHASING, MORE CLOSURE</span><p>Designed for the people who build, deliver, and pass great work forward.</p></section>
        <section id="features" className="feature-section">
          <div className="section-heading"><span className="eyebrow">A LITTLE MORE CLARITY</span><h2>All the important bits.<br /><span>None of the loose ends.</span></h2><p>Handover isn’t an afterthought. It’s the beginning of what comes next.</p></div>
          <div className="feature-grid">
            <article className="feature-card feature-card-lilac"><span className="feature-icon"><Layers3 size={20} /></span><h3>One home for the whole story</h3><p>Gather documents, context, owners, and open questions where the whole team can find them.</p><span className="feature-decoration decoration-stack"><i /><i /><i /></span></article>
            <article className="feature-card feature-card-peach"><span className="feature-icon"><CircleCheck size={20} /></span><h3>Progress without the guesswork</h3><p>Simple, shared checklists show what’s done, what’s missing, and who’s on it.</p><span className="feature-decoration decoration-check"><Check size={34} /></span></article>
            <article className="feature-card feature-card-mint"><span className="feature-icon"><Sparkles size={20} /></span><h3>A thoughtful final pass</h3><p>Spot the details that need a little more attention before calling a project complete.</p><span className="feature-decoration decoration-spark"><Sparkles size={38} /></span></article>
          </div>
        </section>
        <section id="how-it-works" className="steps-section">
          <div className="section-heading"><span className="eyebrow">A SIMPLE LITTLE FLOW</span><h2>Goodbye loose ends.<br /><span>Hello next chapter.</span></h2></div>
          <div className="steps-grid">{steps.map(([number, title, copy]) => <article className="step-card" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </section>
        <section className="landing-cta"><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Make your next handover<br />your best one yet.</h2><p>A little more clarity goes a long way.</p></div><Link className="button button-white button-large" to="/signup">Create your free workspace <ArrowRight size={16} /></Link><Sparkles className="cta-sparkle" size={40} /></section>
      </main>
      <footer className="landing-footer"><Link className="brand brand-dark" to="/"><span className="brand-mark"><Layers3 size={17} /></span><span>handover<span className="brand-dot">.</span></span></Link><span>Make good work easy to pass on.</span><span>© 2026 Handover</span></footer>
    </div>
  )
}