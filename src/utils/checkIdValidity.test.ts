import { checkIdValidity } from './checkIdValidity'

describe('Testing id validity check function.', () => {
  test('Testing string number to be valid.', () => {
    expect(checkIdValidity('123')).toStrictEqual({ id: 123, valid: 1 })
  }),
    test('Testing NaN empty string.', () => {
      expect(checkIdValidity('')).toBe(0)
    }),
    test('Testing NaN string.', () => {
      expect(checkIdValidity('hello!.2')).toBe(0)
    }),
    test('Testing integer number.', () => {
      expect(checkIdValidity(12)).toStrictEqual({ id: 12, valid: 1 })
    }),
    test('Testing float number.', () => {
      expect(checkIdValidity(12.2)).toBe(0)
    })
})
