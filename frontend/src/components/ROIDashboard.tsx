import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Filler
} from 'chart.js'
import {
  Trophy, Clock, CreditCard, Globe2, TrendingUp,
  IndianRupee, AlertTriangle, BookOpen, Save,
  ChevronRight, Bookmark, ShieldCheck, PanelRight, PanelRightClose
} from 'lucide-react'
import { toast } from 'sonner'
import type { ROIResult, DataVerification } from '../types'
import DataVerificationSidebar from './DataVerificationSidebar'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

const TABS = [
  { id: 0, label: 'Summary',  icon: Trophy },
  { id: 1, label: 'Salary',   icon: TrendingUp },
  { id: 2, label: 'Cashflow', icon: CreditCard },
  { id: 3, label: 'Risks',    icon: AlertTriangle },
]

interface Props {
  result: ROIResult
  verification: DataVerification | null
  loanLakhs: number
  name: string
  program: string
  onCompare: () => void
  onReport:  () => void
  onSave?:   () => void
  isSaved?:  boolean
}

export default function ROIDashboard({
  result: r, verification, loanLakhs, name, program,
  onCompare, onReport, onSave, isSaved,
}: Props) {
  const [tab, setTab]         = useState(0)
  const [saved, setSaved]     = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSave = () => {
    onSave?.()
    setSaved(true)
    if (isSaved) toast.success('Analysis saved to your profile!')
    else toast.info('Sign in to save your analyses')
    setTimeout(() => setSaved(false), 4000)
  }

  const metrics = [
    { label: 'Time to first job', value: `${r.ttj_months} months`, icon: Clock,   color: 'text-brand-orange', bar: 'orange' },
    { label: 'Loan breakeven',    value: `Month ${r.breakeven_month}`, icon: CreditCard, color: 'text-blue-600', bar: 'blue' },
    { label: 'PR probability',    value: `${r.pr_probability}%`,  icon: Globe2,   color: 'text-brand-green', bar: 'green' },
  ]
  const salMetrics = [
    { label: 'Year 1', value: r.salary_yr1 },
    { label: 'Year 2', value: r.salary_yr2 },
    { label: 'Year 3', value: r.salary_yr3, green: true },
  ]

  const chartBase = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#6B7A99', font: { size: 11, family: 'Inter' } }, grid: { color: 'rgba(10,37,64,.04)' } },
      y: { ticks: { color: '#6B7A99', font: { family: 'Inter' } },           grid: { color: 'rgba(10,37,64,.04)' } },
    },
  }

  const salData = {
    labels: ['Graduation', 'Year 1', 'Year 2', 'Year 3'],
    datasets: [
      { data: [0, r.salary_yr1_inr, r.salary_yr2_inr, r.salary_yr3_inr], borderColor: '#0A2540', backgroundColor: 'rgba(10,37,64,.07)', fill: true, tension: .4, pointRadius: 5, pointBackgroundColor: '#0A2540' },
      { data: [0, r.india_yr1_inr,  r.india_yr2_inr,  r.india_yr3_inr],  borderColor: '#A8B4C8', borderDash: [5, 5], fill: false, tension: .4, pointRadius: 4 },
    ],
  }

  const emi = Math.round(loanLakhs * 10000 / 84)
  const s1m = Math.round(r.salary_yr1_inr * 100000 / 12 / 1000)
  const cfData = {
    labels: ['M3','M6','M9','M12','M15','M18','M21','M24','M30','M36'],
    datasets: [
      { data: [95,90,90,88,85,82, emi/1000+35, emi/1000+33, emi/1000+30, emi/1000+28].map(Math.round), borderColor: '#FF6B35', backgroundColor: 'rgba(255,107,53,.07)', fill: true, tension: .3, pointRadius: 3 },
      { data: [8,8,10,10,12,12, s1m, s1m*1.1, s1m*1.2, s1m*1.3].map(Math.round),                      borderColor: '#00C48C', backgroundColor: 'rgba(0,196,140,.07)',  fill: true, tension: .3, pointRadius: 3 },
    ],
  }

  const riskColor: Record<string,string> = { Low: '#00C48C', Medium: '#FF6B35', High: '#EF4444' }
  const riskBg:    Record<string,string> = {
    Low:    'bg-green-50 text-brand-green border-green-200',
    Medium: 'bg-orange-50 text-brand-orange border-orange-200',
    High:   'bg-red-50 text-red-500 border-red-200',
  }

  return (
    <div className="animate-slide-up">
      {/* Two-column layout when sidebar is open */}
      <div className={`flex gap-4 items-start ${sidebarOpen ? 'flex-col lg:flex-row' : ''}`}>

        {/* ── MAIN DASHBOARD COLUMN ── */}
        <div className={`space-y-4 ${sidebarOpen ? 'w-full lg:flex-1 min-w-0' : 'w-full'}`}>

          {/* Best pick banner */}
          <div className="bg-navy-900 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/15 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5">Best ROI pick for your profile</div>
              <div className="text-lg font-extrabold text-white">{r.best_university} — {program}</div>
            </div>
            <div className="flex items-center gap-2 relative z-10 flex-wrap">
              <span className="badge-green text-xs px-3.5 py-1.5">
                <Trophy size={11} />Breakeven: month {r.breakeven_month}
              </span>
              {/* Data verification toggle */}
              {verification && (
                <button
                  onClick={() => setSidebarOpen(o => !o)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                    sidebarOpen
                      ? 'bg-white text-navy-900 border-white'
                      : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                  }`}
                >
                  {sidebarOpen
                    ? <><PanelRightClose size={12} />Hide sources</>
                    : <><ShieldCheck size={12} />Data sources ({verification.overallConfidence}% confidence)</>
                  }
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-1.5 flex gap-1 shadow-card">
            {TABS.map(t => {
              const Icon = t.icon
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`tab-btn flex items-center gap-1.5 flex-1 justify-center py-2 transition-all text-xs ${tab === t.id ? 'active' : ''}`}>
                  <Icon size={13} />{t.label}
                </button>
              )
            })}
          </div>

          {/* TAB 0: SUMMARY */}
          {tab === 0 && (
            <div className="space-y-3 animate-fade-in">
              <div className="grid grid-cols-3 gap-3">
                {metrics.map(m => {
                  const Icon = m.icon
                  return (
                    <div key={m.label} className="metric-card">
                      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
                        m.bar === 'orange' ? 'bg-gradient-to-r from-brand-orange to-orange-400' :
                        m.bar === 'green'  ? 'bg-gradient-to-r from-brand-green to-teal-400' :
                                             'bg-gradient-to-r from-blue-500 to-blue-400'
                      }`} />
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-1 flex items-center gap-1">
                        <Icon size={11} />{m.label}
                      </div>
                      <div className={`text-xl font-extrabold tracking-tight ${m.color}`}>{m.value}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">After graduation</div>
                    </div>
                  )
                })}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {salMetrics.map(m => (
                  <div key={m.label} className="metric-card">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <IndianRupee size={11} />Salary {m.label}
                    </div>
                    <div className={`text-lg font-extrabold tracking-tight ${m.green ? 'text-brand-green' : 'text-navy-900'}`}>{m.value}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Post graduation</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="metric-card">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <IndianRupee size={11} />Total degree cost
                  </div>
                  <div className="text-xl font-extrabold text-brand-orange tracking-tight">{r.total_cost_inr}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Tuition + living + fees</div>
                </div>
                <div className="metric-card">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <TrendingUp size={11} />Net ROI at year 3
                  </div>
                  <div className={`text-xl font-extrabold tracking-tight ${r.net_roi_positive ? 'text-brand-green' : 'text-brand-orange'}`}>{r.net_roi_yr3}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">vs India equivalent</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-500 leading-relaxed">{r.narrative}</div>

              <div className="flex gap-2 flex-wrap">
                <button onClick={onCompare} className="btn-outline text-xs px-4 py-2 gap-1.5">
                  <BookOpen size={13} />Compare unis
                </button>
                <button onClick={onReport} className="btn-green text-xs px-4 py-2 gap-1.5">
                  <ChevronRight size={13} />Parent report
                </button>
                <button onClick={handleSave} className={`text-xs px-4 py-2 gap-1.5 btn ${saved ? 'btn-green' : 'btn-outline'}`}>
                  {saved
                    ? <><Bookmark size={13} />Saved!</>
                    : <><Save size={13} />{isSaved ? 'Save to profile' : 'Sign in to save'}</>
                  }
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: SALARY */}
          {tab === 1 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-fade-in">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Salary — abroad vs India equivalent (₹ lakhs/year)</div>
              <div className="relative h-56">
                <Line data={salData} options={{ ...chartBase, scales: { ...chartBase.scales, y: { ...chartBase.scales.y, ticks: { ...chartBase.scales.y.ticks, callback: (v: any) => '₹' + v + 'L' } } } } as any} />
              </div>
              <div className="flex gap-4 mt-3 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-navy-900 block rounded" />Abroad path</div>
                <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-slate-300 block rounded" />India path</div>
              </div>
            </div>
          )}

          {/* TAB 2: CASHFLOW */}
          {tab === 2 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-fade-in">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Monthly cashflow — study vs post-graduation (₹ thousands)</div>
              <div className="relative h-56">
                <Line data={cfData} options={{ ...chartBase, scales: { ...chartBase.scales,
                  y: { ...chartBase.scales.y, ticks: { ...chartBase.scales.y.ticks, callback: (v: any) => '₹' + v + 'k' } },
                  x: { ...chartBase.scales.x, ticks: { ...chartBase.scales.x.ticks, maxRotation: 0, font: { size: 9, family: 'Inter' } } },
                }} as any} />
              </div>
              <div className="flex gap-4 mt-3 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-brand-orange rounded block" />Monthly expenses</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-brand-green rounded block" />Monthly income</div>
              </div>
              <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-brand-orange font-medium">
                Red zone = study period. Green zone = post-graduation. Breakeven at month <strong>{r.breakeven_month}</strong>.
              </div>
            </div>
          )}

          {/* TAB 3: RISKS */}
          {tab === 3 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-fade-in space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Risk profile — personalised flags</div>
              {r.risk_flags.map(flag => (
                <div key={flag.label} className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-navy-900 w-40 flex-shrink-0">{flag.label}</div>
                  <div className="risk-bar">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${flag.pct}%`, background: riskColor[flag.level] }} />
                  </div>
                  <span className={`badge text-[10px] border px-2 py-0.5 ${riskBg[flag.level]}`}>{flag.level}</span>
                </div>
              ))}
              <div className="mt-2 bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-brand-orange font-medium leading-relaxed flex gap-2">
                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />{r.risk_summary}
              </div>
            </div>
          )}
        </div>

        {/* ── SIDEBAR COLUMN ── */}
        {sidebarOpen && verification && (
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 animate-fade-in" style={{ maxHeight: '80vh', position: 'sticky', top: '80px' }}>
            <DataVerificationSidebar
              verification={verification}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
