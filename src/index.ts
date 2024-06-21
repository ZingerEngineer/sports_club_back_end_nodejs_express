import express from 'express'
import router from './routers/router'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { AppDataSource } from './data-source'

dotenv.config()

export const AppDataSourceRes = AppDataSource.initialize()
  .then(async () => {
    console.log('Connected to DB.')
    return AppDataSource
  })
  .catch((error) => console.log(error))

const port = process.env.PORT_SECRET
const app = express()

app.use(bodyParser.json())

app.use('/', router)

app.listen(port, () => {
  console.log(`Listening on port ${port}.`)
})

