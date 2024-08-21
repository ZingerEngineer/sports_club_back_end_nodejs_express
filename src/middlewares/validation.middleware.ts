import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { omit, isEqual } from 'lodash'

const validate = async (schema: ZodSchema, data: any) => {
  try {
    const checkRes = await schema.safeParseAsync(data)
    if (checkRes.error) {
      throw new Error("Data doesn't match the schema")
    }
  } catch (error) {
    console.trace(error)
    throw new Error('Schema validation error')
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
      if (error instanceof Error)
        return res.status(422).json({ message: 'Validation Error', error })
      return res
        .status(422)
        .json({ message: 'Validation Error', err: error.message })
    }
  }

export { validationMiddleWare, validate }
