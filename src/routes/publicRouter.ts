import express from 'express'
import { test } from '../controllers/test.controller'
import {
  loginController,
  logOutController,
  signUpController,
  signUpWithGoogleController,
  signUpWithFaceBookController,
  signUpWithGitHubController,
  verifyEmailController,
  forgotPasswordController
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

publicRouter.get('/auth/OAuth/google', signUpWithGoogleController)

publicRouter.get('/auth/OAuth/faceBook', signUpWithFaceBookController)

publicRouter.get('/auth/OAuth/github', signUpWithGitHubController)

publicRouter.post('/forgot-password', forgotPasswordController)
export default publicRouter
