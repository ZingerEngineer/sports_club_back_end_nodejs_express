import {
  addMinutesToDate,
  getMssqlUTCTimeStamp,
  getJSIsoStringFromMssqlTimeStamp
} from './generateIncomingUTCDate'

describe('Testing generating UTC Dates', () => {
  it('Should work and return timestamp', () => {
    const currentDate = new Date(2023, 0, 20, 12, 0, 0, 0)
    const result = addMinutesToDate(currentDate, 30)
    expect(result.toISOString()).toStrictEqual('2023-01-20T10:30:00.000Z')
  }),
    it('Should convert to mssql timestamp', () => {
      const currentDate = new Date('2023-01-01T12:00:00Z')
      const result = getMssqlUTCTimeStamp(currentDate)
      expect(result).toBe('2023-01-01 12:00:00.000')
    }),
    it('Should get JS ISO string date', () => {
      const currentDate = new Date('2023-01-01T12:00:00Z')
      const mssqlTimeStamp = getMssqlUTCTimeStamp(currentDate)
      const result = getJSIsoStringFromMssqlTimeStamp(mssqlTimeStamp)
      expect(result).toStrictEqual('2023-01-01T12:00:00Z')
    })
})
