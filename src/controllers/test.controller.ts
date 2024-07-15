import { Response } from 'express'

export const test = (_, res: Response) => {
  res.status(200).json({ message: 'Hello World !' })
}
