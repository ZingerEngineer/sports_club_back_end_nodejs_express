import { Request, Response, NextFunction } from 'express'
import { tokenRepository } from '../repositories/token.repository'
import { verify } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const tokenSecret = process.env.TOKEN_SECRET

export const authorization = async (inputToken: string) => {
  if (!inputToken || typeof inputToken !== 'string') {
    throw new Error('invalid token')
  }
  const dbToken = await tokenRepository.findOne({
    where: {
      token: inputToken
    }
  })
  if (!dbToken) throw new Error("token doesn't exist")
  const verificationResults = verify(inputToken, tokenSecret)
  if (!verificationResults) throw new Error('bad token')
  if (dbToken.tokenUseTimes <= 0) throw new Error('token expired')
}

export const authorizationMiddleWare =
  (tokenName: string) => (req: Request, res: Response, next: NextFunction) => {
    try {
      authorization(req.signedCookies[tokenName])
      next()
    } catch (error) {
      res.status(403).json({ message: 'unauthorized access' })
    }
  }
