import express from 'express'
import { test } from '../controllers/test.controller'
import {
  loginController,
  logOutController,
  signUpController,
  signUpWithGoogleController,
  verifyEmailController
} from '../controllers/user.controller'
import { validationMiddleWare } from '../middlewares/validation.middleware'
import {
  userLoginPayLoadSchema,
  userSignUpPayLoadSchema
} from '../validationSchemas/user'

import multer from 'multer'
import { authorizationMiddleWare } from '../middlewares/authorization.middleware'
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

publicRouter.post(
  '/verify/email',
  authorizationMiddleWare('accessToken'),
  authorizationMiddleWare('verificationToken'),
  verifyEmailController
)
publicRouter.post(
  '/logout',
  authorizationMiddleWare('accessToken'),
  logOutController
)

publicRouter.get('/api/sessions/OAuth/google', signUpWithGoogleController)
export default publicRouter
