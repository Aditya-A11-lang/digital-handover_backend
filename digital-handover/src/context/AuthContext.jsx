import { useEffect, useState } from 'react'
import { AuthContext } from './authContext.js'
import { addAuditLog } from '../services/api.js'
import { createTeam, getCurrentUser, listTeams, login as loginRequest, refreshToken, signup as signupRequest } from '../api/services.js'

const USER_KEY = 'handover-user'
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const TEAM_ID_KEY = 'current_team_id'
const TEAM_KEY = 'current_team'

function readUser() {
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Unable to read the saved user session.', error)
    return null
  }
}

function readStoredJson(key) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error(`Unable to read ${key} from the saved session.`, error)
    return null
  }
}

function getResponseValue(response, key) {
  return response?.[key] || response?.data?.[key]
}

function getApiError(error, fallback) {
  const detail = error?.response?.data?.detail
  if (Array.isArray(detail)) return detail.map((item) => item.msg).filter(Boolean).join(' ')
  return detail || error?.message || fallback
}

function normalizeUser(profile) {
  if (!profile) return profile
  return {
    ...profile,
    name: profile.name || profile.full_name || profile.email?.split('@')[0] || 'User',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)
  const [team, setTeam] = useState(() => readStoredJson(TEAM_KEY))
  const [isLoading, setIsLoading] = useState(true)

  function saveTeam(nextTeam) {
    const teamId = nextTeam?.team_id || nextTeam?.id
    if (!teamId) return null
    localStorage.setItem(TEAM_ID_KEY, String(teamId))
    localStorage.setItem(TEAM_KEY, JSON.stringify(nextTeam))
    setTeam(nextTeam)
    return nextTeam
  }

  async function loadTeams() {
    const response = await listTeams()
    const teams = Array.isArray(response) ? response : response?.teams || []
    const savedTeamId = localStorage.getItem(TEAM_ID_KEY)
    const selected = teams.find((item) => String(item.team_id || item.id) === savedTeamId) || teams[0]
    return selected ? saveTeam(selected) : null
  }

  function saveSession(response) {
    const responseData = response?.data || response
    const responseAuthorization = response?.headers?.authorization || response?.headers?.Authorization
    const headerToken = responseAuthorization?.replace(/^Bearer\s+/i, '')
    const accessToken = typeof responseData === 'string'
      ? responseData
      : headerToken
        || responseData?.session?.access_token
        || getResponseValue(response, 'access_token')
        || getResponseValue(response, 'accessToken')
        || getResponseValue(response, 'token')
        || responseData?.jwt
        || responseData?.token?.access_token
    const refreshToken = responseData?.session?.refresh_token
      || getResponseValue(response, 'refresh_token')
      || getResponseValue(response, 'refreshToken')
    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    return accessToken || null
  }

  async function loadProfile() {
    const profile = await getCurrentUser()
    const nextUser = normalizeUser(profile?.user || profile)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
    await loadTeams()
    return nextUser
  }

  useEffect(() => {
    async function restoreSession() {
      if (!localStorage.getItem(ACCESS_TOKEN_KEY) && !localStorage.getItem('token')) {
        setIsLoading(false)
        return
      }

      try {
        await loadProfile()
      } catch (error) {
        const savedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
        if (savedRefreshToken) {
          try {
            const response = await refreshToken({ refresh_token: savedRefreshToken })
            saveSession(response)
            await loadProfile()
          } catch (refreshError) {
            console.error('Unable to refresh the saved backend session.', refreshError)
            localStorage.removeItem(ACCESS_TOKEN_KEY)
            localStorage.removeItem(REFRESH_TOKEN_KEY)
            localStorage.removeItem(USER_KEY)
            localStorage.removeItem(TEAM_ID_KEY)
            localStorage.removeItem(TEAM_KEY)
            setUser(null)
            setTeam(null)
          }
        } else {
          console.error('Unable to restore the saved backend session.', error)
          localStorage.removeItem(ACCESS_TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
          localStorage.removeItem(TEAM_ID_KEY)
          localStorage.removeItem(TEAM_KEY)
          setUser(null)
          setTeam(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  async function signIn(email, password) {
    if (!email.trim() || !password) throw new Error('Enter your email and password.')
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem('token')
    try {
      const response = await loginRequest({ email: email.trim(), password })
      const accessToken = saveSession(response)
      if (!accessToken) {
        throw new Error('Login succeeded, but the backend did not return an access token.')
      }
      const profile = normalizeUser(getResponseValue(response, 'user') || getResponseValue(response, 'profile'))
      if (profile) {
        localStorage.setItem(USER_KEY, JSON.stringify(profile))
        setUser(profile)
      }
      const nextUser = profile || await loadProfile()
      const selectedTeam = await loadTeams()
      if (!selectedTeam) {
        const createdTeam = await createTeam({ name: `${nextUser.name}'s workspace` })
        saveTeam(createdTeam?.team || createdTeam)
      }
      addAuditLog({ action: 'Signed in', actor: nextUser.full_name || nextUser.name || email, detail: 'Started a new backend session' })
      return nextUser
    } catch (error) {
      throw new Error(getApiError(error, 'Unable to sign in. Please try again.'))
    }
  }

  async function signUp({ name, email, password }) {
    if (!name.trim() || !email.trim() || password.length < 8) {
      throw new Error('Add your name, a valid email, and a password with at least 8 characters.')
    }
    await signupRequest({ full_name: name.trim(), email: email.trim(), password })
    return signIn(email, password)
  }

  function signOut() {
    if (user) addAuditLog({ action: 'Signed out', actor: user.full_name || user.name, detail: 'Ended the current backend session' })
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(TEAM_ID_KEY)
    localStorage.removeItem(TEAM_KEY)
    setUser(null)
    setTeam(null)
  }

  function updateUser(updates) {
    const nextUser = { ...user, ...updates }
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
    return nextUser
  }

  const value = { user, team, teamId: localStorage.getItem(TEAM_ID_KEY), isLoading, signIn, signUp, signOut, updateUser, loadTeams }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}