import { useState } from 'react'
import { ArrowUp, Bot, MessageCircle, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { askAssistant } from '../api/chat.js'

export default function AssistantQuestion({ projects }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)

  async function ask(value = question) {
    const message = value.trim()
    if (!message || isSending) return

    setError('')
    setAnswer('')
    setIsSending(true)
    try {
      const reply = await askAssistant({
        message,
        projects: projects.map((project) => ({
          name: project.name,
          client: project.client,
          status: project.status,
          dueDate: project.dueDate,
          owner: project.owner,
          checklist: project.checklist?.map((task) => ({
            title: task.title || task.label,
            done: task.done,
          })),
        })),
      })
      setAnswer(reply)
      setQuestion('')
    } catch (reason) {
      setError(reason.message || 'Unable to reach the assistant. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="dashboard-ai-card" aria-labelledby="dashboard-ai-title">
      <div className="dashboard-ai-copy">
        <span className="dashboard-ai-icon"><Bot size={19} /></span>
        <div>
          <h2 id="dashboard-ai-title">Ask your AI handover assistant</h2>
          <p>Get a quick answer about project progress, upcoming deadlines, or open tasks.</p>
        </div>
        <Link to="/chatbot" className="dashboard-ai-full-chat">
          Open full chat <MessageCircle size={14} />
        </Link>
      </div>

      <div className="dashboard-ai-interaction">
        <form className="dashboard-ai-form" onSubmit={(event) => { event.preventDefault(); ask() }}>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask a question about your handovers…"
            aria-label="Ask the AI handover assistant"
            rows={2}
            maxLength={2000}
            disabled={isSending}
          />
          <button type="submit" disabled={!question.trim() || isSending} aria-label="Ask AI">
            {isSending ? 'Thinking…' : 'Ask AI'} <ArrowUp size={15} />
          </button>
        </form>

        {!answer && !error && !isSending && (
          <div className="dashboard-ai-suggestions" aria-label="Suggested questions">
            {['What is due next?', 'Which tasks are still open?'].map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => ask(suggestion)}>
                <Sparkles size={12} /> {suggestion}
              </button>
            ))}
          </div>
        )}

        {isSending && <p className="dashboard-ai-status" role="status">Getting an answer from the assistant…</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
        {answer && (
          <div className="dashboard-ai-answer" role="status">
            <strong>AI answer</strong>
            <p>{answer}</p>
          </div>
        )}
        <p className="dashboard-ai-disclaimer">Project details are sent to Groq to generate replies. AI can be inaccurate.</p>
      </div>
    </section>
  )
}
