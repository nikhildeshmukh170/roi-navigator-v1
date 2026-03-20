import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ArrowLeft, BarChart3, Globe2, MapPin, Trash2, ExternalLink,
  LogOut, User, Mail, Calendar, BookOpen, Settings, History,
  LayoutDashboard, TrendingUp, Clock, Shield
} from 'lucide-react'
import { useAuth, type SavedSearch } from '../context/AuthContext'

const FLAG: Record<string, string> = {
  Canada: '🇨🇦', UK: '🇬🇧', Australia: '🇦🇺', USA: '🇺🇸'
}

export default function ProfilePage() {
  const { user, logout, deleteSearch } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'overview' | 'history' | 'settings'>('overview')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  if (!user) return null

  const searches = user.savedSearches || []
  const countries = [...new Set(searches.map(s => s.profile.country))]
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully')
    navigate('/')
  }

  const handleDelete = (id: string) => {
    deleteSearch(id)
    setConfirmDelete(null)
    toast.success('Analysis deleted')
  }

  // Navigate to ROI page and load the saved result directly into the dashboard
  const handleLoad = (s: SavedSearch) => {
    navigate('/', {
      state: {
        loadProfile:       s.profile,
        loadResult:        s.result,
        loadVerification:  s.verification,
      }
    })
    toast.success('Report loaded')
  }

  const tabs = [
    { id: 'overview',  label: 'Overview',              icon: LayoutDashboard },
    { id: 'history',   label: `History (${searches.length})`, icon: History },
    { id: 'settings',  label: 'Settings',              icon: Settings },
  ] as const

  return (
    <div className="max-w-4xl mx-auto px-5 pb-16">

      {/* ── HERO HEADER ── */}
      <div className="bg-navy-900 rounded-b-3xl px-8 pt-6 pb-8 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/15 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-brand-green/10 rounded-full translate-y-1/2" />

        <Link
          to="/"
          className="relative z-10 inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15 mb-5 transition-all no-underline"
        >
          <ArrowLeft size={12} />Back to ROI Oracle
        </Link>

        <div className="relative z-10 flex items-center gap-4 flex-wrap">
          <div className="w-16 h-16 rounded-full bg-brand-orange border-4 border-white/20 flex items-center justify-center text-2xl font-extrabold text-white flex-shrink-0">
            {user.avatar}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">{user.name}</h1>
            <p className="text-sm text-white/50 mb-2.5">{user.email}</p>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-white/10 border border-white/15 text-white/80 text-xs font-semibold px-2.5 py-1 rounded-full">
                Member since {formatDate(user.joinedAt)}
              </span>
              <span className="bg-white/10 border border-white/15 text-white/80 text-xs font-semibold px-2.5 py-1 rounded-full">
                {searches.length} {searches.length === 1 ? 'analysis' : 'analyses'}
              </span>
              {countries.length > 0 && (
                <span className="bg-white/10 border border-white/15 text-white/80 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {countries.map(c => FLAG[c] || '').join(' ')} {countries.join(', ')}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-red-500/30 border border-white/15 hover:border-red-400/40 text-white/70 hover:text-red-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <LogOut size={13} />Sign out
          </button>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 mb-6 shadow-card">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id as any)}
            className={`flex items-center gap-2 flex-1 justify-center py-2.5 text-xs font-semibold rounded-xl border-none cursor-pointer transition-all font-sans ${
              tab === id
                ? 'bg-navy-900 text-white shadow-card'
                : 'bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Icon size={13} />{label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div className="space-y-5 animate-fade-in">

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: BarChart3, color: 'bg-brand-orange', val: searches.length,       label: 'Analyses run' },
              { icon: Globe2,    color: 'bg-navy-900',     val: countries.length,       label: 'Countries explored' },
              { icon: MapPin,    color: 'bg-brand-green',  val: [...new Set(searches.map(s => s.profile.city))].length, label: 'Cities analysed' },
            ].map(({ icon: Icon, color, val, label }) => (
              <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-card">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} color="white" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-navy-900 tracking-tight leading-none">{val}</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {searches.length > 0 ? (
            <>
              {/* Latest analysis */}
              <div>
                <div className="section-label">Latest analysis</div>
                <div
                  onClick={() => handleLoad(searches[0])}
                  className="bg-white border-2 border-slate-200 hover:border-brand-orange rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer transition-all hover:shadow-card-md flex-wrap"
                >
                  <div className="text-3xl">{FLAG[searches[0].profile.country] || '🌍'}</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-navy-900 mb-0.5">{searches[0].label}</div>
                    <div className="text-xs text-slate-400">{formatDate(searches[0].createdAt)}</div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    {[
                      [searches[0].result.pr_probability + '%',    'text-brand-green',  'PR prob.'],
                      ['Mo. ' + searches[0].result.breakeven_month, 'text-brand-orange', 'Breakeven'],
                      [searches[0].result.ttj_months + 'mo',        'text-navy-900',     'Time to job'],
                    ].map(([v, c, l]) => (
                      <div key={l} className="text-center">
                        <div className={`text-sm font-extrabold ${c}`}>{v}</div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{l}</div>
                      </div>
                    ))}
                    <button className="btn-orange text-xs py-2 px-3.5 gap-1 pointer-events-none">
                      <ExternalLink size={12} />View report
                    </button>
                  </div>
                </div>
              </div>

              {/* Countries breakdown */}
              {countries.length > 0 && (
                <div>
                  <div className="section-label">Countries explored</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {countries.map(c => {
                      const cnt = searches.filter(s => s.profile.country === c).length
                      const avgBe = Math.round(
                        searches.filter(s => s.profile.country === c)
                          .reduce((a, s) => a + s.result.breakeven_month, 0) / cnt
                      )
                      return (
                        <div key={c} className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-card">
                          <div className="text-3xl mb-2">{FLAG[c] || '🌍'}</div>
                          <div className="text-sm font-bold text-navy-900 mb-0.5">{c}</div>
                          <div className="text-xs text-slate-400 mb-1">{cnt} {cnt === 1 ? 'analysis' : 'analyses'}</div>
                          <div className="text-xs font-bold text-brand-orange">Avg Mo. {avgBe}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-14">
              <div className="text-4xl mb-3">📊</div>
              <div className="text-base font-bold text-navy-900 mb-1.5">No analyses yet</div>
              <div className="text-sm text-slate-400 mb-5">
                Run your first ROI calculation and it'll appear here automatically.
              </div>
              <Link to="/" className="btn-orange text-sm py-2.5 px-6 no-underline inline-flex items-center gap-1.5">
                Calculate my ROI →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── HISTORY ── */}
      {tab === 'history' && (
        <div className="space-y-3 animate-fade-in">
          {searches.length === 0 ? (
            <div className="text-center py-14">
              <div className="text-4xl mb-3">📋</div>
              <div className="text-base font-bold text-navy-900 mb-1.5">No saved analyses</div>
              <div className="text-sm text-slate-400">
                Every ROI calculation you run is automatically saved here.
              </div>
            </div>
          ) : (
            searches.map(s => (
              <div
                key={s.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 hover:border-orange-200 hover:shadow-card transition-all flex-wrap"
              >
                <div className="text-2xl flex-shrink-0">{FLAG[s.profile.country] || '🌍'}</div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-navy-900 mb-0.5 truncate">{s.label}</div>
                  <div className="text-xs text-slate-400">
                    GPA {s.profile.gpa} · ₹{s.profile.loanLakhs}L loan · {s.profile.experience} exp · {formatDate(s.createdAt)}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {[
                    ['Mo.' + s.result.breakeven_month, 'text-brand-orange', 'Breakeven'],
                    [s.result.pr_probability + '%',    'text-brand-green',  'PR'],
                    [s.result.net_roi_yr3,             'text-brand-green',  'Net ROI'],
                  ].map(([v, c, l]) => (
                    <div key={l} className="text-center">
                      <div className={`text-sm font-extrabold ${c}`}>{v}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">{l}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  {/* This is the key fix — loads the saved report */}
                  <button
                    onClick={() => handleLoad(s)}
                    className="btn-outline text-xs py-1.5 px-3 gap-1"
                  >
                    <ExternalLink size={11} />View report
                  </button>

                  {confirmDelete === s.id ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span>Delete?</span>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="bg-red-50 text-red-500 border border-red-200 text-xs font-bold px-2 py-1 rounded-lg cursor-pointer font-sans"
                      >Yes</button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="bg-slate-50 text-slate-400 border border-slate-200 text-xs font-bold px-2 py-1 rounded-lg cursor-pointer font-sans"
                      >No</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(s.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 text-slate-300 hover:border-red-200 hover:text-red-400 hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── SETTINGS ── */}
      {tab === 'settings' && (
        <div className="space-y-3 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
            <div className="section-label mt-0">Account details</div>
            {[
              { icon: User,     label: 'Full name',       val: user.name },
              { icon: Mail,     label: 'Email address',   val: user.email },
              { icon: Calendar, label: 'Member since',    val: formatDate(user.joinedAt) },
              { icon: BookOpen, label: 'Saved analyses',  val: `${searches.length} / 20` },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-none">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Icon size={12} />{label}
                </div>
                <div className="text-sm font-semibold text-navy-900">{val}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
            <div className="section-label mt-0">Data & privacy</div>
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-3.5 mb-4">
              <Shield size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                Your ROI analyses and profile data are stored locally in your browser. Leap Scholar uses this information to provide personalised counselling and match you with the right resources.
              </p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-navy-900">Sign out of ROI Oracle</div>
                <div className="text-xs text-slate-400 mt-0.5">You can sign back in at any time.</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-red-50 text-red-500 border border-red-200 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-all hover:bg-red-100 font-sans"
              >
                <LogOut size={13} />Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
