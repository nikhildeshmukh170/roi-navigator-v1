import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  BarChart3, Mail, Lock, User, Eye, EyeOff,
  CheckCircle2, TrendingUp, Globe2, FileText, ArrowRight, Shield
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

type Mode = 'signin' | 'signup'

export default function AuthPage() {
  const { login, signup } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const switchMode = (m: Mode) => {
    setMode(m)
    setName(''); setEmail(''); setPassword(''); setConfirm('')
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'signup' && password !== confirm) {
      toast.error('Passwords do not match'); return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters'); return
    }
    setLoading(true)
    try {
      if (mode === 'signin') {
        await login(email, password)
        toast.success('Welcome back!')
      } else {
        await signup(name, email, password)
        toast.success(`Account created! Welcome, ${name.split(' ')[0]}`)
      }
      navigate('/')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: TrendingUp,   text: 'Personalised loan breakeven date' },
    { icon: Globe2,       text: 'Salary trajectory vs India path' },
    { icon: CheckCircle2, text: 'PR probability by country' },
    { icon: FileText,     text: 'Parent-ready report in 60 seconds' },
  ]

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* ── LEFT PANEL ── */}
      <div className="bg-navy-900 p-10 lg:p-14 flex items-center">
        <div className="max-w-md w-full">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-10 no-underline">
            <div className="w-11 h-11 bg-brand-orange rounded-xl flex items-center justify-center">
              <BarChart3 size={22} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-white tracking-tight">
                ROI <span className="text-brand-orange">Oracle</span>
              </div>
              <div className="text-xs text-white/40 font-medium mt-0.5">by Leap Scholar</div>
            </div>
          </Link>

          <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight mb-3">
            Know the return on your degree — before you apply.
          </h1>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            Get a personalised financial analysis of your study abroad decision. Create a free account to unlock your full ROI report.
          </p>

          {/* Feature list */}
          <div className="flex flex-col gap-3.5 mb-10">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
                  <Icon size={12} color="white" strokeWidth={3} />
                </div>
                <span className="text-sm text-white/75 font-medium">{text}</span>
              </div>
            ))}
          </div>

          {/* Lock notice */}
          <div className="flex items-start gap-3 bg-white/6 border border-white/10 rounded-2xl p-4">
            <Shield size={18} className="text-brand-orange flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/55 leading-relaxed">
              Your ROI dashboard and report are locked behind a free account. This helps us provide personalised counselling and match you with the right resources.
            </p>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4 bg-white/6 border border-white/10 rounded-2xl p-4 mt-4">
            <div className="flex -space-x-2">
              {['RK','AK','SM','RJ'].map((a, i) => (
                <div
                  key={a}
                  className="w-8 h-8 rounded-full border-2 border-navy-900 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: ['#FF6B35','#7C3AED','#00C48C','#F59E0B'][i] }}
                >{a}</div>
              ))}
            </div>
            <div>
              <div className="text-base font-extrabold text-white">2,400+</div>
              <div className="text-xs text-white/40">students calculated ROI this month</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="bg-slate-50 flex items-center justify-center p-6 lg:p-12">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-card-lg p-8 w-full max-w-[420px] animate-fade-in">

          {/* Mode tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-7">
            {(['signin', 'signup'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer border-none font-sans ${
                  mode === m
                    ? 'bg-white text-navy-900 shadow-card'
                    : 'text-slate-500 bg-transparent'
                }`}
              >
                {m === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-navy-900 mb-1.5 tracking-tight">
              {mode === 'signin' ? 'Welcome back' : 'Get started free'}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              {mode === 'signin'
                ? 'Sign in to view your ROI dashboard and saved reports.'
                : 'Create a free account to unlock your full ROI report and save analyses.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-navy-900">Full name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    className="input-field pl-10"
                    placeholder="Your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-navy-900">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input-field pl-10"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-navy-900">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input-field pl-10 pr-10"
                  type={showPass ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent p-0"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-navy-900">Confirm password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    className="input-field pl-10"
                    type="password"
                    placeholder="Repeat your password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-orange w-full mt-2 py-3 text-sm gap-2 justify-center disabled:opacity-60"
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{mode === 'signin' ? 'Signing in…' : 'Creating account…'}</>
                : <>{mode === 'signin' ? 'Sign in' : 'Create account'}<ArrowRight size={15} /></>
              }
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-5">
            {mode === 'signin'
              ? <>Don't have an account? <button onClick={() => switchMode('signup')} className="text-brand-orange font-semibold border-none bg-transparent cursor-pointer text-xs font-sans">Sign up free</button></>
              : <>Already have an account? <button onClick={() => switchMode('signin')} className="text-brand-orange font-semibold border-none bg-transparent cursor-pointer text-xs font-sans">Sign in</button></>
            }
          </p>
        </div>
      </div>
    </div>
  )
}
