import type { StudentProfile, ROIAnalysisResponse, University } from '../types'

// Use environment variable for API base URL, with fallback to relative path for dev
const API_ORIGIN = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '')
const BASE = API_ORIGIN
  ? `${API_ORIGIN}/api`
  : '/api'

export async function fetchROI(
  profile: StudentProfile
): Promise<ROIAnalysisResponse> {
  const res = await fetch(`${BASE}/roi/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function fetchUniversities(country: string): Promise<University[]> {
  const res = await fetch(`${BASE}/universities/${country}`)
  if (!res.ok) throw new Error('Failed to fetch universities')
  return res.json()
}
