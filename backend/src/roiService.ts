import Groq from 'groq-sdk'
import type { StudentProfile, ROIResult, DataVerification } from './types.js'
import { fetchVerifiedData } from './dataService.js'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })
const MODEL = 'llama-3.3-70b-versatile'

const SYSTEM_PROMPT = `You are ROI Oracle, a degree ROI calculator for Indian students going abroad.

You will be given a student profile AND verified real-world data (salary from Adzuna API, costs from Numbeo, PR statistics from official government sources). You MUST use these verified numbers — do NOT invent or hallucinate values.

Return ONLY valid JSON — no markdown, no code blocks, no explanation.

Required output:
{
  "ttj_months": <integer — use the verified TTJ from the data context>,
  "breakeven_month": <integer — calculate: (loan_lakhs * 10000 / 84) monthly EMI vs net monthly income after costs>,
  "pr_probability": <integer — use the verified PR probability from context>,
  "salary_yr1": <string e.g. "CAD $82k / ₹51L" — use verified salary>,
  "salary_yr2": <string — year 1 × 1.12>,
  "salary_yr3": <string — year 1 × 1.25>,
  "salary_yr1_inr": <integer — lakhs>,
  "salary_yr2_inr": <integer — lakhs>,
  "salary_yr3_inr": <integer — lakhs>,
  "india_yr1_inr": <integer — India equivalent: 18 for CS/Data, 22 for MBA, 16 for MEng>,
  "india_yr2_inr": <integer — India yr1 × 1.15>,
  "india_yr3_inr": <integer — India yr1 × 1.32>,
  "total_cost_inr": <string e.g. "₹41.2L" — tuition + verified annual living cost × degree duration>,
  "net_roi_yr3": <string e.g. "+₹18.4L" — (abroad_total - india_total - total_cost)>,
  "net_roi_positive": <boolean>,
  "best_university": <string — best university for this country and program>,
  "narrative": <string — 3 sentences referencing the actual data sources and real numbers>,
  "parent_highlight": <string — 2 sentences for Indian parents, plain language, real rupee figures>,
  "emi_monthly": <string e.g. "₹24,200/month" — loan_lakhs × 10000 / 84>,
  "risk_flags": [
    {"label": <string>, "level": <"Low"|"Medium"|"High">, "pct": <0-100>, "detail": <one sentence>},
    {"label": <string>, "level": <"Low"|"Medium"|"High">, "pct": <0-100>, "detail": <one sentence>},
    {"label": <string>, "level": <"Low"|"Medium"|"High">, "pct": <0-100>, "detail": <one sentence>}
  ],
  "risk_summary": <string — one sentence, reference a specific number from the data>
}

CRITICAL: Use the verified data values provided. Only use your reasoning for calculations (breakeven, net ROI etc). Never invent salary or cost figures.`

export async function computeROI(
  profile: StudentProfile
): Promise<{ result: ROIResult; verification: DataVerification }> {

  // Step 1: Fetch real-world verified data in parallel
  const verification = await fetchVerifiedData(profile)

  // Step 2: Build context string with real data for Groq
  const dataContext = verification.sources
    .map(s => `${s.metric}: ${s.value} [Source: ${s.source}, Confidence: ${s.confidence}%]`)
    .join('\n')

  const userMessage = `Student profile:
Name: ${profile.name}
GPA: ${profile.gpa}/10
Work experience: ${profile.experience}
Program: ${profile.program}
Country: ${profile.country}
City: ${profile.city}
Loan: ₹${profile.loanLakhs} lakhs
Family income: ${profile.familyIncome}

VERIFIED REAL-WORLD DATA (use these exact values):
${dataContext}

Return ROI JSON using ONLY these verified numbers.`

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 1024,
    temperature: 0.1,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
  })

  const raw = response.choices[0]?.message?.content?.trim() ?? ''
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const result = JSON.parse(cleaned) as ROIResult
  return { result, verification }
}
