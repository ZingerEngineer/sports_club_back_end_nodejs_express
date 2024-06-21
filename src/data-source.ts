import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entity/User'

const username = process.env.DB_USER_NAME_SECRET
const port = parseInt(process.env.DB_PORT_SECRET)
let synchronize = false
if (process.env.NODE_ENV == 'development') synchronize = true

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'localhost',
  port,
  username,
  password: '',
  database: 'sports_club',
  synchronize: synchronize,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: []
})

