import path from 'path'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import budgetRoutes from './routes/budgetRoutes.js'
import goalRoutes from './routes/goalRoutes.js'
import investmentRoutes from './routes/investmentRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: `${__dirname}/.env` })

// validate env variables
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined')
  process.exit(1)
}
if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined')
  process.exit(1)
}

connectDB()

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'BudgetBuddy API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/budgets', budgetRoutes)
app.use('/api/goals', goalRoutes)
app.use('/api/investments', investmentRoutes)
app.use('/api/ai', aiRoutes)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))