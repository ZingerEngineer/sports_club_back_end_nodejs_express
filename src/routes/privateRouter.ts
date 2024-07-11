import express from 'express'
import { test } from '../controllers/test.controller'
import authorization from '../middlewares/authorization'
const privateRouter = express.Router()

privateRouter.use('/test-private', authorization, test)

export default privateRouter
