import express from 'express'
import router from './routes/router'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { AppDataSource } from './data-source'

dotenv.config()
;(async () => {
  await AppDataSource.initialize()
  console.log('Connected to DB successfully.')

  const port = parseInt(process.env.PORT_SECRET)
  const app = express()

  app.use(bodyParser.json())

  app.use('/', router)

  app.listen(port, () => {
    console.log(`Listening on port ${port}.`)
  })
})()

