import { validateDate } from './validateDate'

describe('Testing date validation.', () => {
  test('Old date validation.', () => {
    expect(validateDate('1992-06-11')).toBe(1)
  }),
    test('Modern year date validation.', () => {
      expect(validateDate('2015-02-21')).toBe(1)
    }),
    test('3 digits year date validation.', () => {
      expect(validateDate('850-06-11')).toBe(0)
    }),
    test('Zero days dates validation.', () => {
      expect(validateDate('1992-06-00')).toBe(0)
    }),
    test('One digit month dates validation.', () => {
      expect(validateDate('1992-6-11')).toBe(0)
    })
})
