import { Response } from 'express'

const test = (_, res: Response) => {
  res.status(200).json({ msg: 'Hello World !' })
}

export { test }
