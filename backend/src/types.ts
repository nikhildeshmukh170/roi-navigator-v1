// Shared types — used by both backend and frontend

export interface StudentProfile {
  name: string
  gpa: string
  experience: 'none' | '0-1' | '1-3' | '3+'
  program: string
  country: 'Canada' | 'UK' | 'Australia' | 'USA'
  city: string
  loanLakhs: number
  familyIncome: string
}

export interface RiskFlag {
  label: string
  level: 'Low' | 'Medium' | 'High'
  pct: number
  detail: string
}

export interface ROIResult {
  ttj_months: number
  breakeven_month: number
  pr_probability: number
  salary_yr1: string
  salary_yr2: string
  salary_yr3: string
  salary_yr1_inr: number
  salary_yr2_inr: number
  salary_yr3_inr: number
  india_yr1_inr: number
  india_yr2_inr: number
  india_yr3_inr: number
  total_cost_inr: string
  net_roi_yr3: string
  net_roi_positive: boolean
  best_university: string
  narrative: string
  parent_highlight: string
  emi_monthly: string
  risk_flags: RiskFlag[]
  risk_summary: string
}

export interface University {
  name: string
  loc: string
  tuition: number
  ttj: number
  pr: number
  be: number
  s1: number
  s2: number
  s3: number
  cost_inr: number
}

export type UniversityDB = Record<string, University[]>

// ── Data verification types ──────────────────────────────
export interface DataSource {
  metric: string          // e.g. "Starting salary"
  value: string           // e.g. "CAD $82,400"
  source: string          // e.g. "Adzuna API"
  apiName: string         // e.g. "Adzuna Jobs API"
  lastUpdated: string     // ISO timestamp
  url: string             // Link to source
  confidence: number      // 0–100
  vacanciesFound?: number // Raw vacancy count from Adzuna
  note?: string           // Extra context
}

export interface DataVerification {
  sources: DataSource[]
  overallConfidence: number
  fetchedAt: string
}
