import { Check } from 'lucide-react'

const STEPS = ['Profile', 'Universities', 'ROI Dashboard', 'Compare', 'Report']

export default function Stepper({ current }: { current: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5 shadow-card">
      <div className="flex items-center">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2 shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < current ? 'bg-brand-green text-white' :
                i === current ? 'bg-brand-orange text-white shadow-[0_0_0_4px_rgba(255,107,53,0.15)]' :
                'bg-slate-100 text-slate-400 border border-slate-200'
              }`}>
                {i < current ? <Check size={13} strokeWidth={3} /> : i + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:block whitespace-nowrap ${
                i < current ? 'text-brand-green' : i === current ? 'text-brand-orange' : 'text-slate-400'
              }`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-500 ${i < current ? 'bg-brand-green' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-brand-orange to-orange-400 rounded-full transition-all duration-500" style={{ width: `${(current / 4) * 100}%` }} />
      </div>
    </div>
  )
}
