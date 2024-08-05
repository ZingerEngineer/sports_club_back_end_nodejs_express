import { convertFaceBookToSQLDate } from './convertFaceBookToSQLDate'

describe('Testing sql date converter', () => {
  let birthday: string
  it('Should work for mm/dd/yyyy', () => {
    birthday = '12/21/1974'
    expect(convertFaceBookToSQLDate(birthday)).toStrictEqual('1974-12-21')
  }),
    it('Should work for mm/dd', () => {
      birthday = '12/21'
      expect(convertFaceBookToSQLDate(birthday)).toStrictEqual('2024-12-21')
    }),
    it('Should work for yyyy', () => {
      birthday = '1974'
      expect(convertFaceBookToSQLDate(birthday)).toStrictEqual('1974-01-01')
    })
})
