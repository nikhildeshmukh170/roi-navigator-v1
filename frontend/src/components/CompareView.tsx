import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { Trophy, ArrowRight } from 'lucide-react'
import { fetchUniversities } from '../lib/api'
import type { University } from '../types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

interface Props { country: string; selectedUnis: Set<number>; onReport: () => void }

export default function CompareView({ country, selectedUnis, onReport }: Props) {
  const [unis, setUnis] = useState<University[]>([])
  useEffect(() => { fetchUniversities(country).then(setUnis) }, [country])
  const sel = [...selectedUnis].sort((a, b) => a - b).map(i => unis[i]).filter(Boolean)
  if (!sel.length) return null
  const bestIdx = sel.reduce((bi, u, i) => u.be < sel[bi].be ? i : bi, 0)

  const chartData = {
    labels: sel.map(u => u.name.split(' ').slice(0, 2).join(' ')),
    datasets: [
      { label: 'Time to job (mo.)', data: sel.map(u => u.ttj), backgroundColor: 'rgba(10,37,64,.8)', borderRadius: 6 },
      { label: 'PR probability (%)', data: sel.map(u => u.pr), backgroundColor: 'rgba(0,196,140,.8)', borderRadius: 6 },
      { label: 'Breakeven month', data: sel.map(u => u.be), backgroundColor: 'rgba(255,107,53,.8)', borderRadius: 6 },
    ],
  }

  const rows: [string, (u: University) => string][] = [
    ['Time to job', u => `${u.ttj} mo.`], ['PR probability', u => `${u.pr}%`],
    ['Breakeven', u => `Mo. ${u.be}`], ['Salary yr 2', u => `₹${u.s2}L`], ['Total cost', u => `₹${u.cost_inr / 100000}L`],
  ]

  return (
    <div className="space-y-4 animate-slide-up">
      <div>
        <h2 className="text-xl font-extrabold text-navy-900 tracking-tight mb-1">Side-by-side comparison</h2>
        <p className="text-sm text-slate-500">All metrics personalised to your exact profile — not generic rankings.</p>
      </div>

      <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${sel.length}, minmax(0,1fr))` }}>
        {sel.map((u, i) => (
          <div key={u.name} className={`bg-white rounded-2xl overflow-hidden border-2 transition-all ${i === bestIdx ? 'border-brand-orange shadow-card-md' : 'border-slate-200 shadow-card'}`}>
            <div className={`p-3.5 border-b border-slate-100 ${i === bestIdx ? 'bg-orange-50' : 'bg-slate-50'}`}>
              {i === bestIdx && <div className="badge-orange text-[10px] mb-1.5 inline-flex gap-1"><Trophy size={9} />Best ROI</div>}
              <div className="text-xs font-bold text-navy-900 leading-snug">{u.name}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{u.loc}</div>
            </div>
            <div className="p-3.5">
              {rows.map(([key, val]) => (
                <div key={key} className="flex justify-between text-xs py-1.5 border-b border-slate-50 last:border-none">
                  <span className="text-slate-400 font-medium">{key}</span>
                  <span className="font-bold text-navy-900">{val(u)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
        <div className="relative h-52">
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#6B7A99', font: { size: 11, family: 'Inter' } }, grid: { display: false } }, y: { ticks: { color: '#6B7A99' }, grid: { color: 'rgba(10,37,64,.04)' } } } }} />
        </div>
        <div className="flex gap-4 mt-3 text-xs text-slate-400 font-medium">
          {[['#0A2540', 'Time to job (mo.)'], ['#00C48C', 'PR probability (%)'], ['#FF6B35', 'Breakeven month']].map(([c, l]) => (
            <div key={l} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded block" style={{ background: c }} />{l}</div>
          ))}
        </div>
      </div>

      <button onClick={onReport} className="btn-orange w-full py-3.5 text-sm gap-2 justify-center">
        Generate parent report <ArrowRight size={15} />
      </button>
    </div>
  )
}
