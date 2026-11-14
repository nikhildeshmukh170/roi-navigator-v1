import { useState } from 'react'
import { fetchROI } from '../lib/api'
import type { StudentProfile, ROIResult, DataVerification } from '../types'

export type Step = 0 | 1 | 2 | 3 | 4

export function useROI() {
  const [step, setStep] = useState<Step>(0)
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [result, setResult] = useState<ROIResult | null>(null)
  const [verification, setVerification] = useState<DataVerification | null>(null)
  const [provider, setProvider] = useState('AI analysis')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedUnis, setSelectedUnis] = useState<Set<number>>(new Set([0, 1]))

  const compute = async (p: StudentProfile) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchROI(p)
      setProfile(p)
      setResult(data.result)
      setVerification(data.verification)
      setProvider(data.meta.provider)
      setStep(1)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const loadSaved = (p: StudentProfile, r: ROIResult, v?: DataVerification) => {
    setProfile(p)
    setResult(r)
    setVerification(v ?? null)
    setProvider('AI analysis')
    setStep(2)
  }

  const toggleUni = (i: number) => {
    setSelectedUnis(prev => {
      const next = new Set(prev)
      if (next.has(i)) { if (next.size > 1) next.delete(i) }
      else { if (next.size < 3) next.add(i) }
      return next
    })
  }

  const goTo = (s: Step) => setStep(s)
  const reset = () => {
    setStep(0); setProfile(null); setResult(null)
    setVerification(null); setProvider('AI analysis'); setError(null)
  }

  return {
    step, profile, result, verification, provider, loading, error,
    selectedUnis, compute, loadSaved, toggleUni, goTo, reset
  }
}
