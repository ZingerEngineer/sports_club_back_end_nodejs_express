import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

dotenv.config()

const port = process.env.PORT_SECRET
const app = express()

app.use(bodyParser.json())

app.get('/', (_, res) => {
  res.json({ msg: 'welcome' })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}.`)
})
