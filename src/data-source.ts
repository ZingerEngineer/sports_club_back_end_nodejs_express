import 'reflect-metadata'
import { DataSource } from 'typeorm'
import dotenv from 'dotenv'

dotenv.config()
const database = process.env.DB_NAME_SECRET
const username = process.env.DB_USER_NAME_SECRET
const password = process.env.DB_USER_PASS_SECRET
const port = parseInt(process.env.DB_PORT_SECRET)

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'localhost',
  port,
  username,
  password,
  database,
  synchronize: false,
  logging: false,
  entities: ['./src/entities/*{.ts,.js}'],
  migrations: ['./src/migrations/*{.ts,.js}'],
  subscribers: [],
  extra: {
    trustServerCertificate: true
  }
})

