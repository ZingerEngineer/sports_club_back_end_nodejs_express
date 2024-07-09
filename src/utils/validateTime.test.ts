import { validateTime } from './validateTime'
describe('Testing validate time function.', () => {
  test('Testing correct time format.', () => {
    expect(validateTime('02:12:33.222')).toBe(1)
  }),
    test('Testing non zero time format.', () => {
      expect(validateTime('2:12:33.222')).toBe(0)
    }),
    test('Testing missleading minutes time format.', () => {
      expect(validateTime('12:70:33.222')).toBe(0)
    }),
    test('Testing zeros time format.', () => {
      expect(validateTime('00:00:00.000')).toBe(1)
    }),
    test('Testing more separators ":" time format.', () => {
      expect(validateTime('02::12:33.222')).toBe(0)
    }),
    test('Testing more separators "." time format.', () => {
      expect(validateTime('02:12:33..222')).toBe(0)
    })
})
