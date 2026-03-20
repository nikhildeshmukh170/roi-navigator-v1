import { useState } from 'react'
import { fetchROI } from '../lib/api'
import type { StudentProfile, ROIResult, DataVerification } from '../types'

export type Step = 0 | 1 | 2 | 3 | 4

export function useROI() {
  const [step, setStep] = useState<Step>(0)
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [result, setResult] = useState<ROIResult | null>(null)
  const [verification, setVerification] = useState<DataVerification | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedUnis, setSelectedUnis] = useState<Set<number>>(new Set([0, 1]))

  const compute = async (p: StudentProfile) => {
    setLoading(true)
    setError(null)
    setProfile(p)
    try {
      const data = await fetchROI(p)
      setResult(data.result)
      setVerification(data.verification)
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
    setVerification(null); setError(null)
  }

  return {
    step, profile, result, verification, loading, error,
    selectedUnis, compute, loadSaved, toggleUni, goTo, reset
  }
}
