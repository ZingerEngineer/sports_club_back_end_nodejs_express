import { authorization } from './authorization.middleware'

describe('Authorization middleware', () => {
  it('Should work if the given tokens are correct', () => {
    expect(() => authorization('superSecretToken')).not.toThrow()
  }),
    it("Shouldn't work if the given tokens are correct", () => {
      expect(() => authorization(['123131231'])).toThrow('Unauthorized access')
    })
})
