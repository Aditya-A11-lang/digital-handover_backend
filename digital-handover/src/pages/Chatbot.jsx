import { useMemo, useState } from 'react'
import { ArrowUp, Bot, CheckCircle2, FileText, MessageCircle, Sparkles } from 'lucide-react'
import { askAssistant } from '../api/chat.js'
import { getProjects } from '../services/api.js'

const initialMessage = {
  role: 'assistant',
  text: 'Hi there! I can help you get a quick read on your handovers. Ask about project progress, upcoming dates, or what still needs attention.',
}

export default function Chatbot() {
  const projects = useMemo(() => getProjects(), [])
  const [messages, setMessages] = useState([initialMessage])
  const [question, setQuestion] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  async function send(text = question) {
    const trimmed = text.trim()
    if (!trimmed || isSending) return

    setError('')
    setMessages((current) => [...current, { role: 'user', text: trimmed }])
    setIsSending(true)

    try {
      const reply = await askAssistant({
        message: trimmed,
        history: messages.slice(1).slice(-8),
        projects: projects.map((project) => ({
          name: project.name,
          client: project.client,
          status: project.status,
          dueDate: project.dueDate,
          owner: project.owner,
          checklist: project.checklist,
        })),
      })
      setMessages((current) => [...current, { role: 'assistant', text: reply }])
      setQuestion('')
    } catch (reason) {
      setError(reason.message || 'Unable to reach the handover assistant. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="page-wrap chatbot-page">
      <section className="chat-welcome"><span><Bot size={23} /></span><div><h2>Your handover sidekick.</h2><p>Ask a quick question about the projects in your workspace.</p></div><span className="chat-live"><i /> {isSending ? 'THINKING' : 'READY'}</span></section>
      <section className="chat-panel">
        <div className="chat-panel-header"><span className="chatbot-avatar"><Sparkles size={16} /></span><div><strong>Handover assistant</strong><small>Here to help you wrap things up</small></div><span className="chat-context"><FileText size={14} /> Workspace context</span></div>
        <div className="chat-messages" aria-live="polite" aria-busy={isSending}>{messages.map((message, index) => <article className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><span className="chat-message-avatar">{message.role === 'assistant' ? <MessageCircle size={15} /> : 'Y'}</span><p>{message.text}</p></article>)}</div>
        {messages.length === 1 && <div className="suggested-questions"><span>TRY ASKING</span>{['How are my projects progressing?', 'What still needs to be done?', 'What is due next?'].map((item) => <button key={item} type="button" onClick={() => send(item)} disabled={isSending}>{item}</button>)}</div>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <form className="chat-input-row" onSubmit={(event) => { event.preventDefault(); send() }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={isSending ? 'Thinking…' : 'Ask about your handovers…'} aria-label="Ask the handover assistant" disabled={isSending} /><button className="chat-send" type="submit" disabled={!question.trim() || isSending} aria-label="Send message"><ArrowUp size={17} /></button></form>
        <p className="chat-disclaimer"><CheckCircle2 size={13} /> Project details are sent to Groq to generate replies. AI can be inaccurate.</p>
      </section>
    </div>
  )
}
