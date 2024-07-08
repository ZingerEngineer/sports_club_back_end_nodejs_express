import { validateName } from './validateName'

describe('Testing validateName Function', () => {
  test('Normal small letters name.', () => {
    expect(validateName('ahmed')).toBe(1)
  }),
    test('Normal capital letters name.', () => {
      expect(validateName('AHMED')).toBe(1)
    }),
    test('Name with special character', () => {
      expect(validateName("Mc'alister")).toBe(1)
    }),
    test('Falsy normal name.', () => {
      expect(validateName('Ahmed ')).toBe(0)
    }),
    test('Falsy special character name.', () => {
      expect(validateName('Mc..alister')).toBe(0)
    })
})
