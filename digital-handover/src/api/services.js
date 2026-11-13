import apiClient from './client.js'

function data(response) {
  return response.data
}

export async function signup(payload) {
  return data(await apiClient.post('/auth/signup', payload))
}

export async function login(payload) {
  return data(await apiClient.post('/auth/login', payload))
}

export async function refreshToken(payload) {
  return data(await apiClient.post('/auth/refresh', payload))
}

export async function getCurrentUser() {
  return data(await apiClient.get('/auth/me'))
}

export async function exchangeGithubToken({ code, team_id }) {
  return data(await apiClient.post('/github/exchange', { code, team_id }, { params: { team_id } }))
}

export async function createTeam(payload) {
  return data(await apiClient.post('/teams/create', payload))
}

export async function listTeams() {
  return data(await apiClient.get('/teams/list'))
}

export async function getTeam(team_id) {
  return data(await apiClient.get(`/teams/get/${team_id}`))
}

export async function listTeamMembers(team_id) {
  return data(await apiClient.get(`/teams/${team_id}/members`))
}

export async function addTeamMember(team_id, payload) {
  return data(await apiClient.post(`/teams/${team_id}/add_member`, payload))
}

export async function vectorizeSource(team_id, source_id) {
  return data(await apiClient.post(`/teams/${team_id}/sources/${source_id}/vectorize`))
}

export async function syncGithubSource(team_id, payload) {
  return data(await apiClient.post(`/teams/${team_id}/sources/github/sync`, payload))
}

export async function ingestSource(team_id, payload) {
  return data(await apiClient.post(`/teams/${team_id}/sources`, payload))
}

export async function listSources(team_id, source_platform) {
  return data(await apiClient.get(`/teams/${team_id}/sources`, {
    params: source_platform === undefined ? undefined : { source_platform },
  }))
}

export async function createTask(team_id, payload) {
  return data(await apiClient.post(`/teams/${team_id}/tasks`, payload))
}

export async function listTasks(team_id, status) {
  return data(await apiClient.get(`/teams/${team_id}/tasks`, {
    params: status === undefined ? undefined : { status },
  }))
}

export async function getTask(team_id, task_id) {
  return data(await apiClient.get(`/teams/${team_id}/tasks/${task_id}`))
}

export async function updateTask(team_id, task_id, payload) {
  return data(await apiClient.patch(`/teams/${team_id}/tasks/${task_id}`, payload))
}

export async function deleteTask(team_id, task_id) {
  return data(await apiClient.delete(`/teams/${team_id}/tasks/${task_id}`))
}

export async function createDecision(team_id, payload) {
  return data(await apiClient.post(`/teams/${team_id}/decisions`, payload))
}

export async function listDecisions(team_id) {
  return data(await apiClient.get(`/teams/${team_id}/decisions`))
}

export async function getDecision(team_id, decision_id) {
  return data(await apiClient.get(`/teams/${team_id}/decisions/${decision_id}`))
}

export async function updateDecision(team_id, decision_id, payload) {
  return data(await apiClient.patch(`/teams/${team_id}/decisions/${decision_id}`, payload))
}

export async function deleteDecision(team_id, decision_id) {
  return data(await apiClient.delete(`/teams/${team_id}/decisions/${decision_id}`))
}

export async function healthCheck() {
  return data(await apiClient.get('/health'))
}
