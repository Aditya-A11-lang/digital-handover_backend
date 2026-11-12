import { createContext, useContext, useMemo, useState } from 'react'
import { addAuditLog } from '../services/api.js'

const AuthContext = createContext(null)
const USER_KEY = 'handover-user'

function readUser() {
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Unable to read the saved user session.', error)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)

  function signIn(email, password) {
    if (!email.trim() || !password) throw new Error('Enter your email and password.')
    const saved = JSON.parse(localStorage.getItem('handover-users') || '[]')
    const knownUser = saved.find((item) => item.email.toLowerCase() === email.trim().toLowerCase())
    const nextUser = knownUser || {
      id: crypto.randomUUID(),
      name: email.split('@')[0].replace(/[._-]/g, ' '),
      email: email.trim().toLowerCase(),
      role: 'Project manager',
    }
    if (knownUser && knownUser.password !== password) throw new Error('That password does not match this account.')
    const { password: _password, ...profile } = nextUser
    localStorage.setItem(USER_KEY, JSON.stringify(profile))
    setUser(profile)
    addAuditLog({ action: 'Signed in', actor: profile.name, detail: 'Started a new session' })
    return profile
  }

  function signUp({ name, email, password }) {
    if (!name.trim() || !email.trim() || password.length < 8) {
      throw new Error('Add your name, a valid email, and a password with at least 8 characters.')
    }
    const users = JSON.parse(localStorage.getItem('handover-users') || '[]')
    if (users.some((item) => item.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error('An account with this email already exists. Please sign in.')
    }
    const newUser = { id: crypto.randomUUID(), name: name.trim(), email: email.trim().toLowerCase(), password, role: 'Project manager' }
    localStorage.setItem('handover-users', JSON.stringify([...users, newUser]))
    return signIn(email, password)
  }

  function signOut() {
    if (user) addAuditLog({ action: 'Signed out', actor: user.name, detail: 'Ended the current session' })
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  function updateUser(updates) {
    const nextUser = { ...user, ...updates }
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
    return nextUser
  }

  const value = useMemo(() => ({ user, signIn, signUp, signOut, updateUser }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider.')
  return context
}