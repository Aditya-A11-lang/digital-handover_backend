import { ArrowLeft, Check, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Verification() {
  return (
    <section className="verification-card">
      <span className="verification-icon"><ShieldCheck size={27} /></span>
      <span className="eyebrow">PROJECT SIGN-OFF</span>
      <h2>Ready for a confident handover?</h2>
      <p>Use this final check to make sure the people taking over have the context, access, and next steps they need.</p>
      <ul className="verification-list"><li><Check size={16} /> Important project documentation is linked</li><li><Check size={16} /> Owners and next steps are clear</li><li><Check size={16} /> Open questions are called out</li></ul>
      <Link to="/reviews" className="button button-primary"><ArrowLeft size={15} /> Return to review center</Link>
    </section>
  )
}