import express from 'express'
import { test } from '../controllers/test.controller'
import { authorizationMiddleWare } from '../middlewares/authorization.middleware'
const privateRouter = express.Router()

privateRouter.get('/test-private', authorizationMiddleWare, test)

export default privateRouter
