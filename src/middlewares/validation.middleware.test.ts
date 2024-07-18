import { ParamsDictionary } from 'express-serve-static-core'
import { userSignUpPayLoadSchema } from '../validationSchemas/user'
import { validate, validationMiddleWare } from './validation.middleware'
import { Response, Request } from 'express'
import httpMocks from 'node-mocks-http'
import QueryString from 'qs'
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
        'Validation Error'
      )
    })
  })

  let mockedResponse: httpMocks.MockResponse<Response<any, Record<string, any>>>
  let mockedNext: jest.Mock
  let mockedRequest: httpMocks.MockRequest<
    Request<
      ParamsDictionary,
      any,
      any,
      QueryString.ParsedQs,
      Record<string, any>
    >
  >

  beforeEach(() => {
    mockedRequest = httpMocks.createRequest({
      method: 'POST',
      url: '/v1/signup',
      body: {}
    })
    mockedResponse = httpMocks.createResponse()
    mockedNext = jest.fn()
  })

  test('Testing a truthy request body', () => {
    mockedRequest.body = {
      firstName: 'Ahmed',
      lastName: 'Mohaned',
      email: 'ahmedmohaned@gmail.com',
      phone: '+201111111111',
      password: 'ahmed12345',
      confirmPassword: 'ahmed12345',
      gender: 'Male',
      dob: '2000-11-11',
      job: 'Coach'
    }
    const controllerFunc = validationMiddleWare(userSignUpPayLoadSchema)
    controllerFunc(mockedRequest, mockedResponse, mockedNext)

    expect(mockedResponse.statusCode).toBe(200)
  })
})
