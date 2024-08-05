import { convertFaceBookToSQLDate } from './convertFaceBookToSQLDate'
import { getUserAge } from './getUserAge'

describe('Testing utc date user getter', () => {
  it('should work for correct input', () => {
    expect(getUserAge('1992-12-21')).toStrictEqual(32)
  }),
    it('should work with facebook yyyy', () => {
      expect(getUserAge('1992-12-21')).toStrictEqual(32)
    }),
    it('should work with facebook mm/dd', () => {
      expect(getUserAge(convertFaceBookToSQLDate('10/12'))).toStrictEqual(null)
    }),
    it('should work with facebook mm/dd/yyyy', () => {
      expect(getUserAge(convertFaceBookToSQLDate('10/12/1992'))).toStrictEqual(
        32
      )
    }),
    it('should give null with 2024 or current year', () => {
      expect(getUserAge(convertFaceBookToSQLDate('2024-12-12'))).toStrictEqual(
        null
      )
    })
})
