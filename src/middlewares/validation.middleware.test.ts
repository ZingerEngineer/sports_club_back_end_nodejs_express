import { validate } from './validation.middleware'
import { z } from 'zod'

describe('Testing validation middleware.', () => {
  describe('validate', () => {
    it('should pass if correct', async () => {
      const data = { foo: 'bar' }
      const schema = z.object({
        foo: z.string()
      })

      expect(async () => await validate(schema, data)).not.toThrow()
    })

    it('should fail if not correct', async () => {
      const data = { foo: 'bar' }
      const schema = z.object({
        foo: z.number()
      })
      expect(async () => await validate(schema, data)).rejects.toThrow(
        'Schema validation error'
      )
    })
  })
})
