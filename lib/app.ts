import express from 'express'
import { router as routes } from './routes'

const app = express()

app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))
app.use(routes)

export { app }