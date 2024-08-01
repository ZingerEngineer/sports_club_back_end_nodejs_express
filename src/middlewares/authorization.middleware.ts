import { Request, Response, NextFunction } from 'express'
import { tokenRepository } from '../repositories/token.repository'
import { verify } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const tokenSecret = process.env.TOKEN_SECRET

export const authorization = async (userToken: string) => {
  if (!userToken || typeof userToken !== 'string') {
    throw new Error('missing input token')
  }
  const dbToken = await tokenRepository.findOne({
    where: {
      token: userToken
    }
  })
  if (!dbToken) throw new Error('invalid token')
  const verificationResults = verify(userToken, tokenSecret)
  if (!verificationResults) throw new Error('bad token')
  if (dbToken.tokenUseTimes <= 0) throw new Error('token expired')
}

export const authorizationMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    authorization(req.cookies.token)
    next()
  } catch (error) {
    res.status(403).json({ message: 'unauthorized access' })
  }
}
