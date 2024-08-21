import { Request, Response } from 'express'
import {
  login,
  signUp,
  logOut,
  signUpWithGoogle,
  signUpWithFaceBook,
  signUpWithGitHub,
  changePassword,
  forgotPassword
} from '../actions/auth'

import {
  getUserPorfile,
  patchUserNewChange,
  patchUserNewEmail,
  patchUserNewPassword
} from '../actions/user'
import { verifyEmail } from '../actions/auth'

type TLoginController = (req: Request, res: Response) => Promise<void>
type TLogOutController = (req: Request, res: Response) => Promise<void>
type TSignUpController = (req: Request, res: Response) => Promise<void>
type TVerifyEmailController = (req: Request, res: Response) => Promise<void>
type TSignUpWithGoogleController = (
  req: Request,
  res: Response
) => Promise<void>
type TSignUpWithFaceBook = (req: Request, res: Response) => Promise<void>

const loginController: TLoginController = async (req, res) => {
  try {
    let phone: string = req.body.phone
    let email: string = req.body.email
    let password: string = req.body.password

    if (!email && !phone)
      res.status(400).json({
        message: 'Login failed.',
        reason: 'An email or a phone number is required.'
      })
    if (!password)
      res
        .status(400)
        .json({ message: 'Login failed.', reason: 'A password is required.' })

    const { user, accessToken } = await login(email, phone, password)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: true,
      signed: true,
      maxAge: 60 * 24 * 60 * 60 * 1000
    })
    res.status(200).json({
      message: 'User logged in successfully.',
      user
    })
  } catch (error) {
    res.status(400).json({ message: 'Login failed.' })
  }
}

const signUpController: TSignUpController = async (
  req: Request,
  res: Response
) => {
  try {
    const { firstName, lastName, email, phone, password, gender, dob, job } =
      req.body

    const { user, accessToken, verificationToken } = await signUp(
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      job
    )
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: true,
      signed: true,
      maxAge: 60 * 24 * 60 * 60 * 1000
    })
    res.cookie('verificationToken', verificationToken, {
      httpOnly: true,
      sameSite: true,
      signed: true,
      maxAge: 24 * 60 * 60 * 1000
    })
    res.status(200).json({
      user,
      message: 'User registered successfully.'
    })
  } catch (error) {
    console.trace(error)
    res.status(400).json({ message: 'Signup failed.' })
  }
}

const logOutController: TLogOutController = async (req, res) => {
  try {
    const userId = req.body.id
    const accessToken = req.cookies.accessToken
    await logOut(userId, accessToken)
    res.status(200).json({ message: 'Logged out successfully.' })
  } catch (error) {
    res.status(400).json({ message: 'Logout failed.' })
  }
}

const verifyEmailController: TVerifyEmailController = async (req, res) => {
  try {
    const { verificationToken } = req.cookies
    await verifyEmail(verificationToken)
    res.status(200).json({ message: 'Email verified successfully.' })
  } catch (error) {
    res.status(400).json({ message: 'Verification failed.' })
  }
}

const signUpWithGoogleController: TSignUpWithGoogleController = async (
  req,
  res
) => {
  try {
    const code = req.query.code as string
    if (!code) res.status(400).json({ message: 'Signup with google failed.' })
    const { user, accessToken, verificationToken } = await signUpWithGoogle(
      code
    )

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: true,
      signed: true,
      maxAge: 60 * 24 * 60 * 60 * 1000
    })

    if (verificationToken) {
      res.cookie('verificationToken', verificationToken, {
        httpOnly: true,
        sameSite: true,
        signed: true,
        maxAge: 24 * 60 * 60 * 1000
      })
    }

    res
      .status(200)
      .json({ user, message: 'Signed up with google successfully.' })
  } catch (error) {
    res.status(400).json({ message: 'Signup with google failed.' })
  }
}

const signUpWithFaceBookController: TSignUpWithFaceBook = async (req, res) => {
  const code = req.query.code as string
  const state = req.query.state
  const serverState = process.env.FB_OAUTH_STATE_SECRET

  if (!code) throw new Error('Invalid facebook credentials')

  if (state !== serverState) throw new Error('Invalid facebook credentials')

  try {
    const { user, accessToken, verificationToken } = await signUpWithFaceBook(
      code
    )
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: true,
      signed: true,
      maxAge: 5 * 60 * 1000
    })
    if (verificationToken) {
      res.cookie('verificationToken', verificationToken, {
        httpOnly: true,
        sameSite: true,
        signed: true,
        maxAge: 24 * 60 * 60 * 1000
      })
    }

    res.status(200).json({
      user,
      message: 'Signed up with facebook successfully.'
    })
  } catch (error) {
    res.status(400).json({ message: 'facebook signup failed' })
  }
}

const signUpWithGitHubController = async (req: Request, res: Response) => {
  const code = req.query.code as string
  const state = req.query.state
  const serverState = process.env.GITHUB_STATE_SECRET

  if (!code) throw new Error('Invalid github credentials')

  if (state !== serverState) throw new Error('Invalid github credentials')

  try {
    const { user, accessToken, verificationToken } = await signUpWithGitHub(
      code
    )
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: true,
      signed: true,
      maxAge: 5 * 60 * 1000
    })
    if (verificationToken) {
      res.cookie('verificationToken', verificationToken, {
        httpOnly: true,
        sameSite: true,
        signed: true,
        maxAge: 24 * 60 * 60 * 1000
      })
    }

    res.status(200).json({
      user: user,
      message: 'Signed up with github successfully.'
    })
  } catch (error) {
    res.status(400).json({ message: 'Github signup failed' })
  }
}

const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    if (!email) throw new Error('Missing email')
    await forgotPassword(email)

    res.status(200).json({ message: 'Reset password mail sent successfully.' })
  } catch (error) {
    res.status(400).json({ message: 'Failed to send reset password mail.' })
  }
}
const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const forgotPasswordToken = req.query.t as string
    const { password } = req.body
    await changePassword(password, forgotPasswordToken)
    res.status(200).json({ message: 'Reset password successfully.' })
  } catch (error) {
    res.status(400).json({ message: 'Failed to reset password.' })
  }
}

const getUserPorfilecontroller = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    const user = await getUserPorfile(userId)
    if (!user) throw new Error('User not found')
    res.status(200).json({ user })
  } catch (error) {
    res.status(400).json({ message: 'Failed to get user profile.' })
  }
}

const changeUserFirstNameController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    const newFirstName = req.body.newFirstName
    const updateResults = await patchUserNewChange(
      'firstName',
      newFirstName,
      userId
    )
    if (!updateResults) throw new Error('Failed to update user first name')
    res.status(200).json({ message: 'User first name updated successfully.' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Failed to update user first name.' })
  }
}
const changeUserLastNameController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    const newLastName = req.body.lastName
    const updateResults = await patchUserNewChange(
      'lastName',
      newLastName,
      userId
    )
    if (!updateResults) throw new Error('Failed to update user last name')
    res.status(200).json({ message: 'User last name updated successfully.' })
  } catch (error) {
    res.status(400).json({ message: 'Failed to update user last name.' })
  }
}
const changeUserPictureController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    const newUserProfilePicture = req.body.profilePicture
    const updateResults = await patchUserNewChange(
      'profilePicture',
      newUserProfilePicture,
      userId
    )
    if (!updateResults) throw new Error('Failed to update user profile picture')
    res
      .status(200)
      .json({ message: 'User profile picture updated successfully.' })
  } catch (error) {
    res.status(400).json({ message: 'Failed to update user profile picture.' })
  }
}
const changeUserGenderController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    const newUserGender = req.body.gender
    const updateResults = await patchUserNewChange(
      'gender',
      newUserGender,
      userId
    )
    if (!updateResults) throw new Error('Failed to update user gender')
    res.status(200).json({ message: 'User gender updated successfully.' })
  } catch (error) {
    res.status(400).json({ message: 'Failed to update user gender.' })
  }
}
const changeUserEmailController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    const newUserEmail = req.body.email
    if (!newUserEmail || typeof newUserEmail !== 'string')
      throw new Error('Invalid email')
    const updateResults = await patchUserNewEmail(newUserEmail, userId)
    if (!updateResults) throw new Error('Failed to update user gender')
    res
      .status(200)
      .json({ message: 'User email updated awaiting verifcation.' })
  } catch (error) {
    res.status(400).json({ message: 'Failed to update user email.' })
  }
}
const changeUserPasswordController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    const newUserPassword = req.body.password
    if (!newUserPassword || typeof newUserPassword !== 'string')
      throw new Error('Invalid password')
    const updateResults = await patchUserNewPassword(newUserPassword, userId)
    if (!updateResults) throw new Error('Failed to update user gender')
    res.status(200).json({ message: 'User password updated successfully.' })
  } catch (error) {
    res.status(400).json({ message: 'Failed to update user password.' })
  }
}

export {
  loginController,
  signUpController,
  logOutController,
  verifyEmailController,
  signUpWithFaceBookController,
  signUpWithGoogleController,
  signUpWithGitHubController,
  forgotPasswordController,
  resetPasswordController,
  getUserPorfilecontroller,
  changeUserEmailController,
  changeUserFirstNameController,
  changeUserLastNameController,
  changeUserPasswordController,
  changeUserPictureController,
  changeUserGenderController
}
