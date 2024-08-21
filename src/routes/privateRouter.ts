import express from 'express'
import { test } from '../controllers/test.controller'
import { authorizationMiddleWare } from '../middlewares/authorization.middleware'
import { userRouter } from './userRouter'
import { adminRouter } from './adminRouter'
import { superAdminRouter } from './superAdminRouter'
const privateRouter = express.Router()

privateRouter.get('/test-private', authorizationMiddleWare, test)

privateRouter.use('/user', authorizationMiddleWare('accessToken'), userRouter)
privateRouter.use('/admin', adminRouter)
privateRouter.use('/superAdmin', superAdminRouter)

export default privateRouter
