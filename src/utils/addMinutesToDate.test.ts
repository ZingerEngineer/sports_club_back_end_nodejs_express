import { addMinutesToDate } from './addMinutesToDate'

describe('Testing generating UTC Dates', () => {
  it('Should work and return timestamp', () => {
    const currentDate = new Date(2023, 0, 20, 12, 0, 0, 0)
    const result = addMinutesToDate(currentDate, 30)
    expect(result.toISOString()).toStrictEqual('2023-01-20T10:30:00.000Z')
  })
})
