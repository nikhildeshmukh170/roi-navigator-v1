import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { StudentProfile, ROIResult, DataVerification } from '../types'

export interface SavedSearch {
  id: string
  createdAt: string
  profile: StudentProfile
  result: ROIResult
  verification?: DataVerification
  label: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  joinedAt: string
  savedSearches: SavedSearch[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login:       (email: string, password: string) => Promise<void>
  signup:      (name: string, email: string, password: string) => Promise<void>
  logout:      () => void
  saveSearch:  (profile: StudentProfile, result: ROIResult, verification?: DataVerification) => void
  deleteSearch:(id: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)
const STORAGE_KEY = 'roi_oracle_users'
const SESSION_KEY = 'roi_oracle_session'

function getUsers(): Record<string, User & { password: string }> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}
function saveUsers(u: Record<string, User & { password: string }>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
}
function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<User | null>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY)
    if (session) {
      const users = getUsers()
      const found = users[session]
      if (found) { const { password: _, ...u } = found; setUser(u) }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 800))
    const users = getUsers()
    const found = users[email.toLowerCase()]
    if (!found)                  throw new Error('No account found with this email. Please sign up.')
    if (found.password !== password) throw new Error('Incorrect password. Please try again.')
    const { password: _, ...u } = found
    setUser(u)
    localStorage.setItem(SESSION_KEY, email.toLowerCase())
  }

  const signup = async (name: string, email: string, password: string) => {
    await new Promise(r => setTimeout(r, 800))
    const users = getUsers()
    const key   = email.toLowerCase()
    if (users[key]) throw new Error('An account with this email already exists. Please sign in.')
    const newUser: User & { password: string } = {
      id: Date.now().toString(), name, email: key, password,
      avatar: initials(name), joinedAt: new Date().toISOString(), savedSearches: [],
    }
    users[key] = newUser
    saveUsers(users)
    const { password: _, ...u } = newUser
    setUser(u)
    localStorage.setItem(SESSION_KEY, key)
  }

  const logout = () => { setUser(null); localStorage.removeItem(SESSION_KEY) }

  const saveSearch = (profile: StudentProfile, result: ROIResult, verification?: DataVerification) => {
    if (!user) return
    const users = getUsers()
    const key   = user.email
    if (!users[key]) return
    const search: SavedSearch = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      profile, result, verification,
      label: `${profile.program} · ${profile.city}, ${profile.country}`,
    }
    users[key].savedSearches = [search, ...(users[key].savedSearches || [])].slice(0, 20)
    saveUsers(users)
    setUser(prev => prev ? { ...prev, savedSearches: users[key].savedSearches } : prev)
  }

  const deleteSearch = (id: string) => {
    if (!user) return
    const users = getUsers()
    const key   = user.email
    if (!users[key]) return
    users[key].savedSearches = (users[key].savedSearches || []).filter(s => s.id !== id)
    saveUsers(users)
    setUser(prev => prev ? { ...prev, savedSearches: users[key].savedSearches } : prev)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, saveSearch, deleteSearch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
