import express from 'express'
import router from './routers/router'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

dotenv.config()

const port = process.env.PORT_SECRET
const app = express()

app.use(bodyParser.json())

app.use('/', router)

app.listen(port, () => {
  console.log(`Listening on port ${port}.`)
})
