import express from 'express'
import dotenv from 'dotenv'
import { AppDataSource } from './services/data-source'
import globalRouter from './routes/globalRouter'
import cookieParser from 'cookie-parser'

dotenv.config({
  path: 'src/.env'
})

if (process.env.NODE_ENV === 'development') {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
}

;(async () => {
  try {
    await AppDataSource.initialize()
    console.log('Connected to DB successfully.')

    const port = parseInt(process.env.PORT_SECRET)
    const sessionSecret = process.env.SESSION_SECRET
    const app = express()

    app.use(express.json())
    app.use(cookieParser(sessionSecret))

    app.use('/', globalRouter)

    app.listen(port, () => {
      console.log(`Listening on port ${port}.`)
    })
  } catch (error) {
    console.log(error)
  }
})()
