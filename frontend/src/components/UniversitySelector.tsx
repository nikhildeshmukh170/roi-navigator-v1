import { useEffect, useState } from 'react'
import { MapPin, CheckCircle2, Circle, TrendingUp, ArrowRight } from 'lucide-react'
import { fetchUniversities } from '../lib/api'
import type { University } from '../types'

interface Props {
  country: string
  selectedUnis: Set<number>
  onToggle: (i: number) => void
  onNext: () => void
}

export default function UniversitySelector({ country, selectedUnis, onToggle, onNext }: Props) {
  const [unis, setUnis] = useState<University[]>([])

  useEffect(() => { fetchUniversities(country).then(setUnis) }, [country])

  return (
    <div className="animate-slide-up">
      <div className="mb-5">
        <h2 className="text-xl font-extrabold text-navy-900 tracking-tight mb-1">Pick your universities</h2>
        <p className="text-sm text-slate-500">Ranked by ROI fit for your profile. Select up to 3 to compare side by side.</p>
      </div>

      <div className="flex flex-col gap-2.5 mb-5">
        {unis.map((u, i) => {
          const isSelected = selectedUnis.has(i)
          return (
            <button
              key={u.name}
              onClick={() => onToggle(i)}
              className={`w-full text-left bg-white border rounded-2xl p-4 flex items-center gap-3.5 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-brand-orange shadow-[0_0_0_3px_rgba(255,107,53,0.1)] shadow-card-md'
                  : 'border-slate-200 shadow-card hover:border-orange-200 hover:shadow-card-md hover:translate-x-0.5'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-extrabold transition-all ${
                isSelected ? 'bg-brand-orange text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}>{i + 1}</div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-navy-900">{u.name}</span>
                  <span className="badge-orange text-[10px]">
                    <TrendingUp size={9} />{Math.max(90 - i * 5, 70)}% match
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <MapPin size={11} />{u.loc} · Tuition ~{u.tuition.toLocaleString()}/yr
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-base font-extrabold text-navy-900">Mo. {u.be}</div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Breakeven</div>
              </div>

              <div className="flex-shrink-0">
                {isSelected
                  ? <CheckCircle2 size={20} className="text-brand-orange" />
                  : <Circle size={20} className="text-slate-300" />
                }
              </div>
            </button>
          )
        })}
      </div>

      <button onClick={onNext} className="btn-primary w-full py-3.5 text-sm gap-2 justify-center">
        View my ROI dashboard <ArrowRight size={15} />
      </button>
    </div>
  )
}
