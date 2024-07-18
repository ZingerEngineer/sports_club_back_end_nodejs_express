import express from 'express'
import { test } from '../controllers/test.controller'
import {
  loginController,
  signUpController
} from '../controllers/user.controller'
import { validationMiddleWare } from '../middlewares/validation.middleware'
import {
  userLoginPayLoadSchema,
  userSignUpPayLoadSchema
} from '../validationSchemas/user'

import multer from 'multer'
const upload = multer({ dest: 'uploads/' })

const publicRouter = express.Router()

publicRouter.get('/test', test)
publicRouter.post(
  '/signup',
  upload.none(),
  validationMiddleWare(userSignUpPayLoadSchema),
  signUpController
)
publicRouter.post(
  '/login',
  validationMiddleWare(userLoginPayLoadSchema),
  loginController
)

export default publicRouter
