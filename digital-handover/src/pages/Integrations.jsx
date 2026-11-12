import { useMemo, useState } from 'react'
import { Check, Code2, FolderOpen, MessageCircle, Plug, ToggleLeft, ToggleRight } from 'lucide-react'
import { getIntegrations, toggleIntegration } from '../services/api.js'

const integrationIcons = { message: MessageCircle, folder: FolderOpen, code: Code2, check: Check }

export default function Integrations() {
  const [integrations, setIntegrations] = useState(() => getIntegrations())
  const [error, setError] = useState('')

  function toggle(id) {
    try {
      setIntegrations(toggleIntegration(id))
      setError('')
    } catch (reason) {
      setError(reason.message || 'Unable to update this integration.')
    }
  }

  const connectedCount = useMemo(() => integrations.filter((item) => item.connected).length, [integrations])
  return (
    <div className="page-wrap">
      <section className="integration-intro"><span className="integration-intro-icon"><Plug size={20} /></span><div><span className="eyebrow">YOUR TOOLS, TOGETHER</span><h2>A little less switching tabs.</h2><p>Connect the tools your team already uses to keep project handovers in sync.</p></div><span className="connected-count">{connectedCount} connected</span></section>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="integration-grid">{integrations.map((integration) => {
        const Icon = integrationIcons[integration.icon] || Plug
        return <article className="integration-card" key={integration.id}><div className="integration-card-top"><span className={`integration-logo integration-${integration.id}`}><Icon size={20} /></span><span className={`connection-status${integration.connected ? ' is-connected' : ''}`}><i />{integration.connected ? 'Connected' : 'Not connected'}</span></div><h3>{integration.name}</h3><p>{integration.description}</p><button className={`integration-toggle${integration.connected ? ' toggle-on' : ''}`} type="button" onClick={() => toggle(integration.id)} aria-pressed={integration.connected}>{integration.connected ? <ToggleRight size={23} /> : <ToggleLeft size={23} />}<span>{integration.connected ? 'Disconnect' : 'Connect'}</span></button></article>
      })}</div>
      <p className="demo-disclaimer">Connections in this demo are illustrative and saved only in your browser. External services are not contacted.</p>
    </div>
  )
}