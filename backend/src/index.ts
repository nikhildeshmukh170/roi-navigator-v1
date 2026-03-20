import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { computeROI } from './roiService.js'
import { UNI_DB } from './data.js'
import type { StudentProfile } from './types.js'

const app = express()
const PORT = process.env.PORT || 3001

// Allow requests from multiple origins (dev and production)
const corsOptions = {
  origin: function(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'https://roi-navigator-v1.vercel.app',
      'https://roi-navigator-v1.onrender.com'
    ]
    
    // Allow requests with no origin (mobile apps, curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS not allowed'))
    }
  },
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    groq: !!process.env.GROQ_API_KEY,
    adzuna: !!(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY),
    numbeo: true,
  })
})

app.get('/api/universities/:country', (req, res) => {
  const unis = UNI_DB[req.params.country]
  if (!unis) return res.status(404).json({ error: 'Country not found' })
  res.json(unis)
})

// Now returns { result, verification }
app.post('/api/roi', async (req, res) => {
  try {
    const profile: StudentProfile = req.body
    if (!profile.name || !profile.program || !profile.country || !profile.loanLakhs) {
      return res.status(400).json({ error: 'Missing required profile fields' })
    }
    const data = await computeROI(profile)
    res.json(data)
  } catch (err) {
    console.error('ROI computation error:', err)
    res.status(500).json({ error: 'Failed to compute ROI. Check API keys.' })
  }
})

app.listen(PORT, () => {
  console.log(`\nROI Oracle backend — http://localhost:${PORT}`)
  console.log(`Groq API key:    ${process.env.GROQ_API_KEY   ? '✓' : '✗ MISSING'}`)
  console.log(`Adzuna App ID:   ${process.env.ADZUNA_APP_ID  ? '✓' : '✗ not set (fallback mode)'}`)
  console.log(`Adzuna App Key:  ${process.env.ADZUNA_APP_KEY ? '✓' : '✗ not set (fallback mode)'}`)
})
