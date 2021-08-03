import express from 'express'
import cors from 'cors'
import { router as routes } from './routes'
import { untyped } from './utils'

const app = express()

app.options('*', cors() as untyped)
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))
app.use(cors())
app.use(routes)

export { app }