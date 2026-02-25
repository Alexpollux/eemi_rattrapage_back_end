import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './lib/swagger'
import authRoutes from './routes/auth.routes'
import applicationRoutes from './routes/application.routes'
import uploadRoutes from './routes/upload.routes'

const app = express()

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://eemi-candidature-l8kyjrqqp-alexpolluxs-projects.vercel.app'
  ],
  credentials: true
}))
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/', (req, res) => {
  res.json({ message: 'EEMI API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/upload', uploadRoutes)

export default app