import express from 'express'          // import, not require
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js' // DB logic lives elsewhere

dotenv.config()

// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined')
  process.exit(1)
}
if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined')
  process.exit(1)
}

connectDB() // connects to MongoDB — defined in config/db.js

const app = express()

app.use(cors({ origin: 'http://localhost:5173' })) // Vite runs on 5173
app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'BudgetBuddy API is running' })
})

// Routes 
import authRoutes from './routes/authRoutes.js'
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))