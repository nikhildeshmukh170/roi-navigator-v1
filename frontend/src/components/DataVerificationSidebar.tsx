import {
  ExternalLink, CheckCircle2, Clock, Database,
  TrendingUp, AlertCircle, X, Shield, Wifi,
  AlertTriangle, Info
} from 'lucide-react'
import type { DataVerification } from '../types'

interface Props {
  verification: DataVerification
  onClose?: () => void
}

function ConfidenceBar({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-brand-green' :
    score >= 65 ? 'bg-amber-400' :
    'bg-orange-400'
  const label =
    score >= 80 ? 'High' :
    score >= 65 ? 'Medium' :
    'Low'
  const textColor =
    score >= 80 ? 'text-brand-green' :
    score >= 65 ? 'text-amber-600' :
    'text-orange-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-[10px] font-bold w-16 ${textColor}`}>{score}% {label}</span>
    </div>
  )
}

function SourceBadge({ apiName }: { apiName: string }) {
  const name = apiName.toLowerCase()
  const isLive =
    name.includes('adzuna') ||
    name.includes('numbeo') ||
    name.includes('rbi')

  return isLive ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-brand-green border border-green-200">
      <Wifi size={9} />LIVE
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
      <Database size={9} />PUBLISHED
    </span>
  )
}

function formatTimestamp(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch { return iso }
}

// Check if Adzuna is configured (salary source says Adzuna API and is live)
function hasLiveAdzuna(verification: DataVerification) {
  return verification.sources.some(
    s => s.apiName === 'Adzuna API' && s.vacanciesFound !== undefined
  )
}

export default function DataVerificationSidebar({ verification, onClose }: Props) {
  const { sources, overallConfidence, fetchedAt } = verification
  const liveAdzuna = hasLiveAdzuna(verification)

  const overallColor =
    overallConfidence >= 80 ? 'text-brand-green' :
    overallConfidence >= 65 ? 'text-amber-600' :
    'text-orange-500'

  const overallBg =
    overallConfidence >= 80 ? 'bg-brand-green-light border-green-200' :
    overallConfidence >= 65 ? 'bg-amber-50 border-amber-200' :
    'bg-orange-50 border-orange-200'

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card-md" style={{ maxHeight: '80vh' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="bg-navy-900 px-5 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-orange rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield size={14} color="white" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white tracking-tight">Data Verification</div>
            <div className="text-[10px] text-white/50 font-medium">Source citations for every number</div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors cursor-pointer border-none bg-transparent p-1"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* ── Adzuna key warning (shown when not live) ──────── */}
      {/* {!liveAdzuna && (
        <div className="mx-4 mt-4 flex-shrink-0 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-amber-700 mb-0.5">Salary data: published benchmarks</div>
            <div className="text-[11px] text-amber-600 leading-relaxed">
              Add <code className="bg-amber-100 px-1 rounded text-[10px]">ADZUNA_APP_ID</code> and{' '}
              <code className="bg-amber-100 px-1 rounded text-[10px]">ADZUNA_APP_KEY</code> to your{' '}
              <code className="bg-amber-100 px-1 rounded text-[10px]">backend/.env</code> to get live salary data from real job listings.
              Free key at <strong>developer.adzuna.com</strong>.
            </div>
          </div>
        </div>
      )} */}

      {/* ── Overall confidence ────────────────────────────── */}
      <div className={`mx-4 mt-3 mb-3 p-3.5 rounded-xl border ${overallBg} flex-shrink-0`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Overall confidence</span>
          <span className={`text-xl font-extrabold ${overallColor}`}>{overallConfidence}%</span>
        </div>
        <ConfidenceBar score={overallConfidence} />
        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 font-medium">
          <Clock size={10} />Data fetched {formatTimestamp(fetchedAt)}
        </div>
      </div>

      {/* ── Confidence explanation ────────────────────────── */}
      <div className="mx-4 mb-3 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3 flex-shrink-0">
        <Info size={12} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-[11px] text-blue-700 leading-relaxed">
          <strong>LIVE</strong> = fetched from API right now. <strong>PUBLISHED</strong> = verified from official reports.
          {liveAdzuna && <> Salary confidence = 40% base + 1% per 10 live vacancies found (max 95%).</>}
        </div>
      </div>

      {/* ── Source cards — scrollable ─────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {sources.map((src, idx) => (
          <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 transition-all hover:border-slate-300">

            {/* Metric + badge */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{src.metric}</div>
              <SourceBadge apiName={src.apiName} />
            </div>

            {/* Value — the number shown in the dashboard */}
            <div className="text-sm font-extrabold text-navy-900 mb-2.5 leading-snug">
              {src.value}
            </div>

            {/* Source tag + open link */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 flex-1 min-w-0">
                <Database size={9} className="text-slate-400 flex-shrink-0" />
                <span className="truncate">Source: {src.source}</span>
              </div>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-brand-orange hover:border-orange-200 transition-colors flex-shrink-0"
                title="Open source in new tab"
              >
                <ExternalLink size={11} />
              </a>
            </div>

            {/* Confidence bar */}
            <ConfidenceBar score={src.confidence} />

            {/* Live vacancy count (Adzuna only) */}
            {src.vacanciesFound !== undefined && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 bg-white border border-green-200 text-[10px] font-bold text-brand-green px-2.5 py-1 rounded-full">
                  <TrendingUp size={9} />
                  {src.vacanciesFound.toLocaleString()} live vacancies found
                </span>
              </div>
            )}

            {/* Timestamps */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-2">
              <Clock size={9} />
              Last updated: {formatTimestamp(src.lastUpdated)}
            </div>

            {/* Note */}
            {src.note && (
              <div className="flex items-start gap-1.5 mt-2 text-[10px] text-slate-500 leading-relaxed bg-white border border-slate-100 rounded-lg px-2.5 py-2">
                <AlertCircle size={9} className="flex-shrink-0 text-slate-300 mt-0.5" />
                {src.note}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-slate-100 bg-slate-50">
        <div className="flex items-start gap-2">
          <CheckCircle2 size={11} className="text-brand-green flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Salary from <strong className="text-slate-600">Adzuna live listings</strong> · PR stats from{' '}
            <strong className="text-slate-600">official government sources</strong> · TTJ from{' '}
            <strong className="text-slate-600">THE Employability Ranking 2026</strong> · Cost from{' '}
            <strong className="text-slate-600">Numbeo live API</strong> · FX from{' '}
            <strong className="text-slate-600">RBI</strong>. All external links open to their source.
          </p>
        </div>
      </div>
    </div>
  )
}
