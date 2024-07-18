import { Request, Response } from 'express'
import { login, signUp, logOut } from '../actions/auth'

type loginController = (req: Request, res: Response) => Promise<void>
type logOutController = (req: Request, res: Response) => Promise<void>
type signUpController = (req: Request, res: Response) => Promise<void>

const loginController: loginController = async (req, res) => {
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

const signUpController: signUpController = async (
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

const logOutController: logOutController = async (req, res) => {
  try {
    const userId = req.body.id
    if (!userId) res.status(400).json({ message: 'Error happened.' })
    await logOut(userId)
  } catch (error) {
    console.log(error)
    return null
  }
}

export { loginController, signUpController, logOutController }
