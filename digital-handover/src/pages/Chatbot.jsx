import { useMemo, useState } from 'react'
import { ArrowUp, Bot, CheckCircle2, FileText, MessageCircle, Sparkles } from 'lucide-react'
import { getProjects } from '../services/api.js'

function getReply(question, projects) {
  const text = question.toLowerCase()
  if (text.includes('progress') || text.includes('status')) {
    return projects.map((project) => {
      const done = project.checklist.filter((task) => task.done).length
      return `${project.name} is ${project.status.toLowerCase()} with ${done} of ${project.checklist.length} handover items complete.`
    }).join(' ')
  }
  if (text.includes('overdue') || text.includes('due')) {
    const soon = projects.filter((project) => project.status !== 'Completed').sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]
    return soon ? `${soon.name} is the next active project due, on ${new Date(`${soon.dueDate}T12:00:00`).toLocaleDateString('en', { month: 'long', day: 'numeric' })}. Check its handover checklist for remaining items.` : 'There are no active project deadlines in your workspace.'
  }
  if (text.includes('checklist') || text.includes('missing') || text.includes('next')) {
    const open = projects.flatMap((project) => project.checklist.filter((task) => !task.done).map((task) => `${task.title} for ${project.name}`))
    return open.length ? `Here are a few open items to focus on: ${open.slice(0, 3).join('; ')}.` : 'All handover checklist items are complete. Nice work!'
  }
  return `A thoughtful handover includes clear project context, access and resource links, known issues, open decisions, and named owners for next steps. You currently have ${projects.length} projects in this workspace. Try asking me about progress, upcoming due dates, or open checklist items.`
}

export default function Chatbot() {
  const projects = useMemo(() => getProjects(), [])
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hi there! I can help you get a quick read on your handovers. Ask about project progress, upcoming dates, or what still needs attention.' }])
  const [question, setQuestion] = useState('')

  function send(text = question) {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((current) => [...current, { role: 'user', text: trimmed }, { role: 'assistant', text: getReply(trimmed, projects) }])
    setQuestion('')
  }

  return (
    <div className="page-wrap chatbot-page">
      <section className="chat-welcome"><span><Bot size={23} /></span><div><h2>Your handover sidekick.</h2><p>Ask a quick question about the projects in your workspace.</p></div><span className="chat-live"><i /> READY</span></section>
      <section className="chat-panel">
        <div className="chat-panel-header"><span className="chatbot-avatar"><Sparkles size={16} /></span><div><strong>Handover assistant</strong><small>Here to help you wrap things up</small></div><span className="chat-context"><FileText size={14} /> Workspace context</span></div>
        <div className="chat-messages" aria-live="polite">{messages.map((message, index) => <article className={`chat-message ${message.role}`} key={index}><span className="chat-message-avatar">{message.role === 'assistant' ? <MessageCircle size={15} /> : 'Y'}</span><p>{message.text}</p></article>)}</div>
        {messages.length === 1 && <div className="suggested-questions"><span>TRY ASKING</span>{['How are my projects progressing?', 'What still needs to be done?', 'What is due next?'].map((item) => <button key={item} type="button" onClick={() => send(item)}>{item}</button>)}</div>}
        <form className="chat-input-row" onSubmit={(event) => { event.preventDefault(); send() }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about your handovers…" aria-label="Ask the handover assistant" /><button className="chat-send" type="submit" disabled={!question.trim()} aria-label="Send message"><ArrowUp size={17} /></button></form>
        <p className="chat-disclaimer"><CheckCircle2 size={13} /> This demo assistant answers from locally saved project information.</p>
      </section>
    </div>
  )
}