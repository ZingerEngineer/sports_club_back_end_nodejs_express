import { validateTruthyNotEmptyString } from './validateTruthyNotEmptyString'

describe('Testing truthy not empty strings.', () => {
  test('Testing empty string.', () => {
    expect(validateTruthyNotEmptyString('')).toBe(1)
  }),
    test('Testing not empty string.', () => {
      expect(validateTruthyNotEmptyString('ahmed')).toBe(1)
    }),
    test('Testing not empty number string.', () => {
      expect(validateTruthyNotEmptyString('1231231')).toBe(1)
    }),
    test('Testing brackets string.', () => {
      expect(validateTruthyNotEmptyString('[]')).toBe(1)
    })
})
