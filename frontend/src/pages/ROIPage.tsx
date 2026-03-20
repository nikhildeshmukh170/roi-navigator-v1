import { useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { Lock, BookmarkCheck, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useROI } from '../hooks/useROI'
import Stepper from '../components/Stepper'
import ProfileForm from '../components/ProfileForm'
import UniversitySelector from '../components/UniversitySelector'
import ROIDashboard from '../components/ROIDashboard'
import CompareView from '../components/CompareView'
import ParentReport from '../components/ParentReport'
import type { Step } from '../hooks/useROI'
import type { StudentProfile, ROIResult, DataVerification } from '../types'

export default function ROIPage() {
  const { user, saveSearch } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const {
    step, profile, result, verification, loading, error,
    selectedUnis, compute, loadSaved, toggleUni, goTo, reset,
  } = useROI()

  // Load a saved report navigated from ProfilePage
  useEffect(() => {
    const state = location.state as {
      loadProfile?: StudentProfile
      loadResult?:  ROIResult
      loadVerification?: DataVerification
    } | null
    if (state?.loadProfile && state?.loadResult) {
      loadSaved(state.loadProfile, state.loadResult, state.loadVerification)
      window.history.replaceState({}, '')
    }
  }, [])

  const handleSave = (p: StudentProfile, r: ROIResult, v: DataVerification | null) => {
    if (!user) { toast.error('Please sign in to save analyses'); navigate('/auth'); return }
    saveSearch(p, r, v ?? undefined)
    toast.success('Analysis saved to your profile!', { icon: <BookmarkCheck size={16} /> })
  }

  // Auth gate shown for steps 1+ when not logged in
  const AuthGate = () => (
    <div className="card p-10 text-center animate-fade-in">
      <div className="w-14 h-14 bg-orange-50 border-2 border-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Lock size={24} className="text-brand-orange" />
      </div>
      <h2 className="text-lg font-extrabold text-navy-900 mb-2 tracking-tight">
        Sign in to view your ROI report
      </h2>
      <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-sm mx-auto">
        Your ROI dashboard, salary trajectory, risk analysis, and parent report are locked behind a free account.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link to="/auth" className="btn-orange py-2.5 px-6 text-sm gap-2 no-underline inline-flex items-center">
          <LogIn size={15} />Sign in / Create account
        </Link>
        <button onClick={reset} className="btn-outline py-2.5 px-5 text-sm">← Edit profile</button>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-5 py-7">
      <Stepper current={step} />

      {step === 0 && <ProfileForm onSubmit={compute} loading={loading} error={error} />}

      {step >= 1 && !user && <AuthGate />}

      {step === 1 && user && profile && (
        <UniversitySelector
          country={profile.country}
          selectedUnis={selectedUnis}
          onToggle={toggleUni}
          onNext={() => goTo(2 as Step)}
        />
      )}

      {step === 2 && user && result && profile && (
        <ROIDashboard
          result={result}
          verification={verification}
          loanLakhs={profile.loanLakhs}
          name={profile.name}
          program={profile.program}
          onCompare={() => goTo(3 as Step)}
          onReport={() => goTo(4 as Step)}
          onSave={() => handleSave(profile, result, verification)}
          isSaved
        />
      )}

      {step === 3 && user && profile && (
        <CompareView
          country={profile.country}
          selectedUnis={selectedUnis}
          onReport={() => goTo(4 as Step)}
        />
      )}

      {step === 4 && user && result && profile && (
        <ParentReport
          result={result}
          profile={profile}
          verification={verification}
          onBack={() => goTo(2 as Step)}
        />
      )}
    </div>
  )
}
