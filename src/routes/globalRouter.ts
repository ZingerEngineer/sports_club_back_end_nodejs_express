import express from 'express'
import v1Router from './v1Router'
const globalRouter = express.Router()

globalRouter.use('/v1', v1Router)

export default globalRouter
