const STORAGE_KEYS = {
  projects: 'handover-projects',
  audit: 'handover-audit',
  integrations: 'handover-integrations',
}

const initialProjects = [
  {
    id: 'northstar',
    name: 'Northstar Commerce',
    client: 'Northstar Retail Group',
    description: 'A unified commerce platform and customer experience refresh.',
    status: 'In progress',
    dueDate: '2026-12-18',
    owner: 'Olivia Chen',
    color: 'violet',
    updatedAt: '2026-11-11T14:30:00.000Z',
    checklist: [
      { id: 'n1', title: 'Project scope and success metrics', done: true, owner: 'Olivia Chen' },
      { id: 'n2', title: 'Architecture and infrastructure overview', done: true, owner: 'Marcus Lee' },
      { id: 'n3', title: 'Repository access and deployment guide', done: true, owner: 'Jamie Rivera' },
      { id: 'n4', title: 'Known issues and open decisions', done: false, owner: 'Olivia Chen' },
      { id: 'n5', title: 'Client walkthrough and sign-off', done: false, owner: 'Olivia Chen' },
    ],
  },
  {
    id: 'atlas',
    name: 'Atlas Mobile App',
    client: 'Atlas Health',
    description: 'Patient-facing mobile app with secure appointment management.',
    status: 'Review',
    dueDate: '2026-11-28',
    owner: 'Noah Patel',
    color: 'blue',
    updatedAt: '2026-11-10T09:15:00.000Z',
    checklist: [
      { id: 'a1', title: 'Product requirements and user journeys', done: true, owner: 'Noah Patel' },
      { id: 'a2', title: 'Security review and compliance notes', done: true, owner: 'Sam Brooks' },
      { id: 'a3', title: 'Release notes and app store checklist', done: false, owner: 'Noah Patel' },
      { id: 'a4', title: 'Support contacts and escalation paths', done: false, owner: 'Sam Brooks' },
    ],
  },
  {
    id: 'evergreen',
    name: 'Evergreen Rebrand',
    client: 'Evergreen Energy',
    description: 'Brand system rollout across the web, sales, and partner materials.',
    status: 'Completed',
    dueDate: '2026-11-08',
    owner: 'Ava Williams',
    color: 'green',
    updatedAt: '2026-11-08T17:00:00.000Z',
    checklist: [
      { id: 'e1', title: 'Brand guidelines and asset library', done: true, owner: 'Ava Williams' },
      { id: 'e2', title: 'CMS editing and publishing guide', done: true, owner: 'Taylor Kim' },
      { id: 'e3', title: 'Final review and client approval', done: true, owner: 'Ava Williams' },
    ],
  },
]

const initialIntegrations = [
  { id: 'slack', name: 'Slack', description: 'Get handover updates in your project channel.', connected: true, icon: 'message' },
  { id: 'drive', name: 'Google Drive', description: 'Link shared project documents and folders.', connected: true, icon: 'folder' },
  { id: 'github', name: 'GitHub', description: 'Connect repositories and release notes.', connected: false, icon: 'code' },
  { id: 'linear', name: 'Linear', description: 'Keep handover tasks in sync with issues.', connected: false, icon: 'check' },
]

function readList(key, fallback) {
  const stored = localStorage.getItem(key)
  if (stored === null) {
    localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }
  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) throw new Error('Expected a list.')
    return parsed
  } catch (error) {
    throw new Error(`Could not read saved app data for "${key}". Clear this app's local storage to reset the demo.`, { cause: error })
  }
}

function writeList(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getProjects() {
  return readList(STORAGE_KEYS.projects, initialProjects)
}

export function getProject(id) {
  return getProjects().find((project) => project.id === id) || null
}

export function createProject(values) {
  const projects = getProjects()
  const project = {
    id: crypto.randomUUID(),
    name: values.name.trim(),
    client: values.client.trim(),
    description: values.description.trim(),
    status: 'Planning',
    dueDate: values.dueDate,
    owner: values.owner.trim() || 'You',
    color: ['violet', 'blue', 'green'][projects.length % 3],
    updatedAt: new Date().toISOString(),
    checklist: [
      { id: crypto.randomUUID(), title: 'Project scope and success metrics', done: false, owner: values.owner.trim() || 'You' },
      { id: crypto.randomUUID(), title: 'Architecture and infrastructure overview', done: false, owner: values.owner.trim() || 'You' },
      { id: crypto.randomUUID(), title: 'Repository access and deployment guide', done: false, owner: values.owner.trim() || 'You' },
      { id: crypto.randomUUID(), title: 'Known issues and open decisions', done: false, owner: values.owner.trim() || 'You' },
    ],
  }
  writeList(STORAGE_KEYS.projects, [project, ...projects])
  addAuditLog({ action: 'Project created', actor: project.owner, detail: `${project.name} · ${project.client}` })
  return project
}

export function updateProject(id, updates, actor = 'You') {
  const projects = getProjects()
  const index = projects.findIndex((project) => project.id === id)
  if (index < 0) throw new Error('This project could not be found.')
  const nextProject = { ...projects[index], ...updates, updatedAt: new Date().toISOString() }
  projects[index] = nextProject
  writeList(STORAGE_KEYS.projects, projects)
  addAuditLog({ action: 'Project updated', actor, detail: nextProject.name })
  return nextProject
}

export function getAuditLogs() {
  return readList(STORAGE_KEYS.audit, [
    { id: 'log-1', action: 'Handover checklist updated', actor: 'Olivia Chen', detail: 'Northstar Commerce', createdAt: '2026-11-11T14:30:00.000Z' },
    { id: 'log-2', action: 'Project moved to review', actor: 'Noah Patel', detail: 'Atlas Mobile App', createdAt: '2026-11-10T09:15:00.000Z' },
    { id: 'log-3', action: 'Final sign-off received', actor: 'Ava Williams', detail: 'Evergreen Rebrand', createdAt: '2026-11-08T17:00:00.000Z' },
  ])
}

export function addAuditLog({ action, actor = 'You', detail }) {
  const entries = readList(STORAGE_KEYS.audit, [])
  const entry = { id: crypto.randomUUID(), action, actor, detail, createdAt: new Date().toISOString() }
  writeList(STORAGE_KEYS.audit, [entry, ...entries].slice(0, 100))
  return entry
}

export function getIntegrations() {
  return readList(STORAGE_KEYS.integrations, initialIntegrations)
}

export function toggleIntegration(id) {
  const integrations = getIntegrations()
  const item = integrations.find((integration) => integration.id === id)
  if (!item) throw new Error('This integration could not be found.')
  item.connected = !item.connected
  writeList(STORAGE_KEYS.integrations, integrations)
  addAuditLog({ action: item.connected ? 'Integration connected' : 'Integration disconnected', detail: item.name })
  return integrations
}