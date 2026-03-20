# ROI Oracle — Leap AI Hackathon 2026

Personalised degree ROI calculator for Indian students going abroad.
Built with React + Vite (frontend) and Express.js + TypeScript (backend), powered by Claude AI.

---

## Setup — do this once

### 1. Backend
```bash
cd backend
npm install
```

Edit `.env` and paste your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3001
```

Start backend:
```bash
npm run dev
```

You should see:
```
ROI Oracle backend running on http://localhost:3001
Claude API key: ✓ loaded
```

### 2. Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## Project structure

```
roi-oracle/
├── backend/
│   ├── src/
│   │   ├── index.ts          ← Express server + routes
│   │   ├── roiService.ts     ← Claude API call + system prompt
│   │   ├── data.ts           ← University database (4 countries)
│   │   └── types.ts          ← Shared TypeScript types
│   ├── .env                  ← API key goes here
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.tsx            ← Main screen router
    │   ├── main.tsx           ← Entry point
    │   ├── index.css          ← All styles
    │   ├── components/
    │   │   ├── ProfileForm.tsx
    │   │   ├── UniversitySelector.tsx
    │   │   ├── ROIDashboard.tsx   ← 4 tabs: summary, salary, cashflow, risks
    │   │   ├── CompareView.tsx
    │   │   ├── ParentReport.tsx
    │   │   └── Stepper.tsx
    │   ├── hooks/
    │   │   └── useROI.ts      ← All state management
    │   ├── lib/
    │   │   └── api.ts         ← API client
    │   └── types/
    │       └── index.ts
    ├── index.html
    └── package.json
```

---

## Demo flow (5 screens)

1. **Profile** — student fills name, GPA, program, country, loan amount
2. **Universities** — select up to 3 to compare (pre-ranked by match)
3. **ROI Dashboard** — 4 tabs: summary metrics, salary trajectory chart, cashflow model, risk factors
4. **Compare** — side-by-side university comparison with bar chart
5. **Parent Report** — plain-language summary with WhatsApp share + LeapFinance CTA

---

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/universities/:country | Universities for a country |
| POST | /api/roi | Compute ROI (calls Claude API) |

### POST /api/roi — request body
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

---

## Hackathon pitch notes

- **Efficiency**: counselors take 2–3 hours to manually estimate ROI per student. This does it in ~10 seconds.
- **Business impact**: directly accelerates LeapFinance loan conversions (60% of Leap's revenue).
- **Demo**: use Priya's pre-filled profile for the live demo — it's already loaded on screen 1.
- **Unique**: every competitor shows a university list. ROI Oracle shows a financial outcome with a breakeven date parents understand immediately.
