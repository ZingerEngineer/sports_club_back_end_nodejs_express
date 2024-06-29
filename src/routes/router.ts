import express, { Response } from 'express'
const router = express.Router()

router.get('/', (_, res: Response) => {
  res.json({ msg: 'welcome' })
})
export default router
