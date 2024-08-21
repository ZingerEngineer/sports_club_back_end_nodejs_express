import express from 'express'
import {
  changeUserEmailController,
  changeUserFirstNameController,
  changeUserPasswordController,
  getUserPorfilecontroller
} from '../controllers/user.controller'
import { validationMiddleWare } from '../middlewares/validation.middleware'
import {
  userPatchEmailPayLoadSchema,
  userPatchFirstNameSchema,
  userPatchLastNameSchema,
  userPatchPasswordPayLoadSchema,
  userPatchProfilePictureSchema
} from '../validationSchemas/user'
export const userRouter = express.Router()

userRouter.get('/profile')

userRouter.get('/profile/:id', getUserPorfilecontroller)
userRouter.patch(
  '/profile/email/:id',
  validationMiddleWare(userPatchEmailPayLoadSchema),
  changeUserEmailController
)
userRouter.patch(
  '/profile/password/:id',
  validationMiddleWare(userPatchPasswordPayLoadSchema),
  changeUserPasswordController
)
userRouter.patch(
  '/profile/profilePicture/:id',
  validationMiddleWare(userPatchProfilePictureSchema),
  changeUserFirstNameController
)
userRouter.patch(
  '/profile/firstname/:id',
  validationMiddleWare(userPatchFirstNameSchema),
  changeUserFirstNameController
)
userRouter.patch(
  '/profile/lastname/:id',
  validationMiddleWare(userPatchLastNameSchema),
  changeUserFirstNameController
)
