import { Request, Response } from 'express'
import { login, signUp, logOut } from '../actions/auth'
import { verifyEmail } from '../actions/auth'

type TLoginController = (req: Request, res: Response) => Promise<void>
type TLogOutController = (req: Request, res: Response) => Promise<void>
type TSignUpController = (req: Request, res: Response) => Promise<void>
type TVerifyEmailController = (req: Request, res: Response) => Promise<void>

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

    const { user, session } = await login(email, phone, password)
    res.status(200).json({
      message: 'User logged in successfully.',
      user,
      session
    })
  } catch (error) {
    console.log(error)
    return null
  }
}

const signUpController: TSignUpController = async (
  req: Request,
  res: Response
) => {
  try {
    const { firstName, lastName, email, phone, password, gender, dob, job } =
      req.body

    const { user, session } = await signUp(
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      job
    )
    if (!session) res.status(500)
    res.cookie('sessionId', session.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: session.expiresAt
    })
    res.status(200).json({
      user,
      message: 'User registered successfully.'
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Signup failed.' })
  }
}

const logOutController: TLogOutController = async (req, res) => {
  try {
    const userId = req.body.id
    if (!userId) res.status(400).json({ message: 'Error happened.' })
    await logOut(userId)
  } catch (error) {
    console.log(error)
    return null
  }
}

const verifyEmailController: TVerifyEmailController = async (req, res) => {
  try {
    const { token } = req.headers
    if (token) res.status(400).json({ message: 'Verification failed.' })

    if (typeof token === 'string') await verifyEmail(token)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Verification failed.' })
  }
}

export {
  loginController,
  signUpController,
  logOutController,
  verifyEmailController
}
