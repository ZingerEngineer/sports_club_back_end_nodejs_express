import { Request, Response, NextFunction } from 'express'
import { userSignUpPayLoadSchema } from '../validationSchemas/user'
import { ZodSchema } from 'zod'

const validate = async (schema: ZodSchema, data: any) => {
  try {
    const checkRes = await schema.safeParseAsync(data)
    if (checkRes.error) {
      throw new Error('Validation Error')
    }
  } catch (error) {
    throw new Error('Validation Error')
  }
}

const validationMiddleWare =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      await validate(schema, body)
      next()
    } catch (error) {
      return res.status(422).json({ message: 'Validation error' })
    }
  }

export { validationMiddleWare, validate }
