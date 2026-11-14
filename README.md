# ROI Navigator

ROI Navigator helps students compare the potential costs, earnings, and risks of studying abroad. Enter a student profile to generate a personalized report with salary estimates, an estimated time to first job, a loan breakeven estimate, residency context, and a comparison with an India-based career path.

The app is built as a React and TypeScript web client with an Express and TypeScript API. The API combines configured AI analysis with live data where available and published benchmarks when a live source is unavailable.

> **Important:** ROI Navigator is a planning aid, not financial, immigration, admissions, or employment advice. Salaries, living costs, job-search timelines, residency figures, and ROI are estimates based on the configured sources and assumptions. They are not guarantees. Verify current costs, visa rules, university fees, exchange rates, and loan terms before making a decision.

## What the product does

- **Build a student profile:** enter GPA, work experience, target program, destination, city, expected loan, and family income.
- **Review a personalized ROI analysis:** explore salary projections, total estimated degree cost, time to first job, loan breakeven, residency context, and risk factors.
- **Compare universities:** choose universities for a side-by-side comparison for the selected destination.
- **Share a parent-friendly report:** download a PDF or share a summary through WhatsApp.
- **Edit and recalculate:** return to the profile form from the dashboard; the current report stays visible if you cancel, and is replaced after a successful recalculation.
- **Save analyses:** signed-in demo users can save and revisit reports in their browser.

## How an analysis works

1. The browser sends the profile to `POST /api/roi/`.
2. The backend gathers the available salary, cost-of-living, exchange-rate, job-timing, and residency inputs. Adzuna salary data is optional; when it is not configured or does not yield usable results, the service uses its published salary benchmarks. Cost-of-living data also has a published fallback.
3. The backend sends the profile and collected data to its configured AI service for a structured ROI response.
4. The browser displays the result alongside a source and confidence summary so users can inspect where the inputs came from.

Some inputs are maintained benchmarks rather than live data. The current implementation includes country-level salary and cost fallbacks, program-and-country job-timing benchmarks, residency statistics, and fixed exchange-rate assumptions. Data availability and freshness can affect the result.

## Technology

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, Chart.js.
- **Backend:** Node.js 18+, Express 4, TypeScript.
- **AI analysis:** Groq API, configured on the backend with `GROQ_API_KEY`. The key must never be placed in frontend environment variables or committed to source control.
- **External data:** Adzuna is optional; Numbeo is queried by the backend where available. Published fallback benchmarks keep analysis available when those sources cannot provide usable data.
- **Persistence:** demo accounts and saved analyses are stored in browser `localStorage`; they are not synchronized to a server.

## Requirements

- Node.js 18 or later and npm.
- A Groq API key for AI-generated analysis.
- Optional Adzuna application ID and key for live job-listing salary data.

## Run locally

### 1. Configure and start the backend

In PowerShell:

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Edit `backend/.env` and set `GROQ_API_KEY`. `ADZUNA_APP_ID` and `ADZUNA_APP_KEY` are optional; leave their example values if you do not have them. Do not commit `.env`.

Start the API:

```powershell
npm run dev
```

The backend listens on `http://localhost:3001` by default.

### 2. Configure and start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). In local development, Vite proxies `/api` requests to `http://localhost:3001`. To use another API origin, set `VITE_API_BASE_URL` in the frontend environment.

## Production builds

Build the backend:

```powershell
cd backend
npm run build
npm start
```

Build the frontend:

```powershell
cd frontend
npm run build
```

The frontend build is written to `frontend/dist`. Configure the hosting platform to serve that directory and point `VITE_API_BASE_URL` at the deployed API origin when frontend and backend use different origins. Configure backend secrets in the hosting provider's environment settings.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Reports API status and whether AI and optional data integrations are configured. |
| `GET` | `/api/universities/:country` | Returns the university comparison data for a supported country. |
| `POST` | `/api/roi/` | Computes a student ROI report and returns its data-source summary and metadata. |

### `POST /api/roi/`

Request body:

```json
{
  "name": "Priya Rajan",
  "gpa": "7.8",
  "experience": "0-1",
  "program": "MSc Computer Science",
  "country": "Canada",
  "city": "Toronto",
  "loanLakhs": 28,
  "familyIncome": "₹50,000 – ₹1,00,000"
}
```

The response has three top-level properties:

- `result`: salary projections, cost and breakeven estimates, narrative, and risk indicators.
- `verification`: the inputs used, source details, confidence indicators, and fetch time.
- `meta`: analysis label and generation time.

Example response shape (values shortened):

```json
{
  "result": {
    "ttj_months": 9,
    "breakeven_month": 36,
    "pr_probability": 68,
    "salary_yr1": "CAD $82,000 / ₹51L",
    "risk_flags": []
  },
  "verification": {
    "sources": [],
    "overallConfidence": 78,
    "fetchedAt": "2026-01-01T00:00:00.000Z"
  },
  "meta": {
    "provider": "AI analysis",
    "generatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

The example is illustrative; actual estimates and available sources depend on the profile and external services.

## Repository layout

```text
backend/
  src/
    index.ts          Express app, health check, and API routes
    roiService.ts     AI request and structured ROI response
    dataService.ts    External data lookups and benchmark fallbacks
    data.ts           University comparison data
    types.ts          Backend request and response types
frontend/
  src/
    components/       Profile form, dashboard, comparisons, and reports
    context/          Demo authentication and saved analyses
    hooks/            ROI analysis state and actions
    lib/api.ts        Browser-to-backend API client
    pages/            Application routes and screens
    types/            Frontend request and response types
```

## Demo account and data note

Authentication is currently a browser-only demo: account information, including passwords, is stored in `localStorage`. Saved reports are also kept in that browser and can be cleared by clearing site data. This implementation is suitable for a local demonstration, not production authentication or storage. Do not use a real password or sensitive personal information.

## Troubleshooting

- **AI analysis fails:** confirm the backend is running and `GROQ_API_KEY` is set in `backend/.env`, then restart the backend.
- **Live salary data is unavailable:** verify both Adzuna credentials. Without working credentials or usable listings, the published salary benchmark is used.
- **The frontend cannot reach the API:** check that the backend is listening on port `3001`, or configure `VITE_API_BASE_URL` for the API origin and restart Vite.
- **University lookup returns 404:** use a supported country name in the URL, such as `Canada`, `UK`, `Australia`, or `USA`.
