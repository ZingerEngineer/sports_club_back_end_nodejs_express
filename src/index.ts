import express from 'express'
import router from './routers/router'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { AppDataSource } from './data-source'
import { User } from './entity/User'

dotenv.config()

AppDataSource.initialize()
  .then(async () => {
    console.log('Inserting a new user into the database...')
    const user = new User()
    user.firstName = 'Timber'
    user.lastName = 'Saw'
    user.age = 25
    await AppDataSource.manager.save(user)
    console.log('Saved a new user with id: ' + user.id)

    console.log('Loading users from the database...')
    const users = await AppDataSource.manager.find(User)
    console.log('Loaded users: ', users)

    console.log(
      'Here you can setup and run express / fastify / any other framework.'
    )
  })
  .catch((error) => console.log(error))

const port = process.env.PORT_SECRET
const app = express()

app.use(bodyParser.json())

app.use('/', router)

app.listen(port, () => {
  console.log(`Listening on port ${port}.`)
})

