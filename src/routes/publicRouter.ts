import express from 'express'
import { test } from '../controllers/test.controller'
import {
  loginController,
  signUpController,
  verifyEmailController
} from '../controllers/user.controller'
import { validationMiddleWare } from '../middlewares/validation.middleware'
import {
  userLoginPayLoadSchema,
  userSignUpPayLoadSchema
} from '../validationSchemas/user'

import multer from 'multer'
import { authorization } from '../middlewares/authorization.middleware'
const upload = multer({ dest: 'uploads/' })

const publicRouter = express.Router()

publicRouter.get('/test', test)
publicRouter.post(
  '/signup',
  validationMiddleWare(userSignUpPayLoadSchema),
  signUpController
)
publicRouter.post(
  '/login',
  validationMiddleWare(userLoginPayLoadSchema),
  loginController
)

publicRouter.post('/verify/email', authorization, verifyEmailController)

export default publicRouter
