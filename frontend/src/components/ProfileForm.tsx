import { useState } from 'react'
import {
  User, Star, Briefcase, BookOpen, Globe2,
  MapPin, IndianRupee, Wallet, Sparkles, ArrowRight
} from 'lucide-react'
import type { StudentProfile } from '../types'

const CITIES: Record<string, string[]> = {
  Canada: ['Toronto', 'Vancouver'],
  UK: ['London', 'Manchester'],
  Australia: ['Melbourne', 'Sydney'],
  USA: ['New York', 'Boston'],
}

const PROGRAMS = [
  'MSc Computer Science',
  'MSc Data Science',
  'MSc Artificial Intelligence',
  'MBA',
  'MSc Finance',
  'MEng Electrical Engineering',
]

const INCOME_OPTIONS = [
  'Under ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000 – ₹2,00,000',
  'Over ₹2,00,000',
]

const COUNTRIES = ['Canada', 'UK', 'Australia', 'USA']
const EXPERIENCE = ['none', '0-1', '1-3', '3+']

interface Props {
  onSubmit: (p: StudentProfile) => void
  loading: boolean
  error: string | null
}

export default function ProfileForm({ onSubmit, loading, error }: Props) {
  const [form, setForm] = useState<StudentProfile>({
    name: '',
    gpa: '',
    experience: 'none',
    program: '',
    country: 'Canada',
    city: 'Toronto',
    loanLakhs: 0,
    familyIncome: '',
  })

  const set = (k: keyof StudentProfile, v: string | number) =>
    setForm(f => ({
      ...f,
      [k]: v,
      ...(k === 'country' ? { city: CITIES[v as string][0] } : {}),
    }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  const stats = [
    { val: '60s', label: 'To results', color: 'text-brand-orange' },
    { val: '7+',  label: 'ROI metrics', color: 'text-navy-900' },
    { val: '4',   label: 'Countries',   color: 'text-brand-green' },
    { val: '500K+', label: 'Alumni data', color: 'text-navy-900' },
  ]

  return (
    <form onSubmit={handleSubmit} className="card-featured p-7 animate-slide-up">
      {/* Hero */}
      <div className="inline-flex items-center gap-2 bg-brand-green-light text-brand-green text-xs font-bold px-3 py-1.5 rounded-full border border-green-200 mb-4">
        <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse-dot" />
        Built for Smarter Decisions
      </div>
      <h1 className="text-2xl font-extrabold text-navy-900 leading-snug tracking-tight mb-2">
        Find out if studying abroad<br />
        <span className="text-brand-orange">is worth it for you</span>
      </h1>
      <p className="text-sm text-slate-500 leading-relaxed mb-5 max-w-lg">
        Fill in your profile and get a personalised ROI — time to job, loan breakeven, PR probability, salary trajectory, and a parent-ready report. Sign in to unlock your results.
      </p>

      {/* Stats */}
      <div className="flex gap-5 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
        {stats.map(s => (
          <div key={s.label}>
            <div className={`text-lg font-extrabold ${s.color} tracking-tight`}>{s.val}</div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-2 gap-3.5 mb-2">

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-navy-900 flex items-center gap-1.5">
            <User size={12} className="text-slate-400" />Full name
          </label>
          <input
            className="input-field"
            placeholder="e.g. Rahul Sharma"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-navy-900 flex items-center gap-1.5">
            <Star size={12} className="text-slate-400" />GPA (out of 10)
          </label>
          <input
            className="input-field"
            placeholder="e.g. 7.8"
            value={form.gpa}
            onChange={e => set('gpa', e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-navy-900 flex items-center gap-1.5">
            <Briefcase size={12} className="text-slate-400" />Work experience
          </label>
          <select className="input-field" value={form.experience} onChange={e => set('experience', e.target.value)}>
            {EXPERIENCE.map(o => <option key={o} value={o}>{o === 'none' ? 'None' : `${o} years`}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-navy-900 flex items-center gap-1.5">
            <BookOpen size={12} className="text-slate-400" />Target program
          </label>
          <select className="input-field" value={form.program} onChange={e => set('program', e.target.value)} required>
            <option value="" disabled>Select a program</option>
            {PROGRAMS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-navy-900 flex items-center gap-1.5">
            <Globe2 size={12} className="text-slate-400" />Target country
          </label>
          <select className="input-field" value={form.country} onChange={e => set('country', e.target.value)}>
            {COUNTRIES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-navy-900 flex items-center gap-1.5">
            <MapPin size={12} className="text-slate-400" />Preferred city
          </label>
          <select className="input-field" value={form.city} onChange={e => set('city', e.target.value)}>
            {(CITIES[form.country] || []).map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-navy-900 flex items-center gap-1.5">
            <IndianRupee size={12} className="text-slate-400" />Loan needed (₹ lakhs)
          </label>
          <input
            className="input-field"
            type="number"
            placeholder="e.g. 25"
            min={5}
            max={100}
            value={form.loanLakhs || ''}
            onChange={e => set('loanLakhs', Number(e.target.value))}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-navy-900 flex items-center gap-1.5">
            <Wallet size={12} className="text-slate-400" />Family monthly income
          </label>
          <select className="input-field" value={form.familyIncome} onChange={e => set('familyIncome', e.target.value)} required>
            <option value="" disabled>Select income range</option>
            {INCOME_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-3.5 py-2.5 rounded-xl">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-orange w-full mt-4 py-3.5 text-sm justify-center gap-2"
      >
        {loading
          ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Analysing with Groq AI…</>
          : <><Sparkles size={15} />Calculate my ROI<ArrowRight size={15} /></>
        }
      </button>
    </form>
  )
}
