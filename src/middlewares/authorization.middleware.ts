import { Request, Response, NextFunction } from 'express'

export const authorization = (token: string | string[]) => {
  if (!token || typeof token !== 'string') {
    throw new Error('Unauthorized access')
  }
}

export const authorizationMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    authorization(req.headers.token)
    next()
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized access' })
  }
}
