import express from 'express'
import { test } from '../controllers/test.controller'

const publicRouter = express.Router()

publicRouter.use('/test', test)

export default publicRouter
