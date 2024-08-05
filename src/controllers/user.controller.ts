import { Request, Response } from 'express'
import {
  login,
  signUp,
  logOut,
  getGoogleUser,
  signUpWithGoogle,
  signUpWithFaceBook,
  signUpWithGitHub,
  changePassword
} from '../actions/auth'
import { verifyEmail } from '../actions/auth'
import { getGoogleOAuthTokens } from '../services/google.oauth.services'

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
        reason: 'An Email or a phone number is required.'
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
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      job,
      teamNameRelatingUserJob
    } = req.body

    const { user, accessToken, verificationToken } = await signUp(
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      job,
      teamNameRelatingUserJob
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
      maxAge: 5 * 60 * 1000
    })
    res.status(200).json({
      user,
      message: 'User registered successfully.'
    })
  } catch (error) {
    res.status(400).json({ message: 'Signup failed.' })
  }
}

const logOutController: TLogOutController = async (req, res) => {
  try {
    const userId = req.body.id
    const accessToken = req.cookies.accessToken
    await logOut(userId, accessToken)
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    res.status(400).json({ message: 'Logout failed.' })
  }
}

const verifyEmailController: TVerifyEmailController = async (req, res) => {
  try {
    const { verificationToken } = req.cookies
    await verifyEmail(verificationToken)
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
    if (!code) res.status(403).json({ message: 'google code missing' })
    const { user, accessToken, verificationToken } = await signUpWithGoogle(
      code
    )

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: true,
      signed: true,
      maxAge: 60 * 24 * 60 * 60 * 1000
    })
    if (verificationToken)
      res.cookie('verificationToken', verificationToken, {
        httpOnly: true,
        sameSite: true,
        signed: true,
        maxAge: 5 * 60 * 1000
      })

    res.status(200).json({ user })
  } catch (error) {
    res.status(400).json({ message: 'google signup failed' })
  }
}

const signUpWithFaceBookController: TSignUpWithFaceBook = async (req, res) => {
  const code = req.query.code as string
  const state = req.query.state
  const serverState = process.env.FB_OAUTH_STATE_SECRET

  if (!code) throw new Error('missing auth code')

  if (state !== serverState) throw new Error('invalid state')

  try {
    const { accessToken, user } = await signUpWithFaceBook(code)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: true,
      signed: true,
      maxAge: 5 * 60 * 1000
    })
    res.status(200).json({
      user
    })
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'facebook signup failed' })
  }
}

const signUpWithGitHubController = async (req: Request, res: Response) => {
  const code = req.query.code as string
  const state = req.query.state
  const serverState = process.env.GITHUB_STATE_SECRET

  if (!code) throw new Error('missing auth code')

  if (state !== serverState) throw new Error('invalid state')

  try {
    const { user, accessToken } = await signUpWithGitHub(code)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: true,
      signed: true,
      maxAge: 5 * 60 * 1000
    })
    res.status(200).json({
      user
    })
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'github signup failed' })
  }
}

const forgotPasswordController = (req: Request, res: Response) => {
  const { email } = req.body
  if (!email) throw new Error('missing email')
  await changePassword(email)
}

export {
  loginController,
  signUpController,
  logOutController,
  verifyEmailController,
  signUpWithFaceBookController,
  signUpWithGoogleController,
  signUpWithGitHubController,
  forgotPasswordController
}
