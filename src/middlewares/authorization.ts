import { Request, Response, NextFunction } from 'express'

const authorization = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.token)
      res.status(401).json({ message: 'Unauthorized access' })
    return next()
  } catch (error) {
    console.log(error)
    return next()
  }
}

export default authorization
