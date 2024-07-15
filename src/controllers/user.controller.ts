import { Request, Response } from 'express'
import { signUp } from '../actions/auth/signUp'

const userControllerLogin = (req: Request, res: Response) => {
  try {
    let phone: null | string
    let email: null | string
    let password: null | string

    req.body.phone ? (phone = req.body.phone) : null
    req.body.email ? (email = req.body.email) : null
    req.body.password ? (password = req.body.email) : null

    if (!password) return null
    if (!email) return null
  } catch (error) {
    console.log(error)
    return null
  }
}

const userControllerSignUp = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, password, gender, dob, job } =
      req.body

    const { user, sessionId } = await signUp(
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      job,
      Date.now()
    )
    if (!sessionId) res.status(500)
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    })
    res.status(200).json({
      user
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Signup failed.' })
  }
}
