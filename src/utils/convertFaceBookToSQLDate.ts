export const convertFaceBookToSQLDate = (birthday: string) => {
  if (!birthday) return null

  let year: string, month: string, day: string

  if (/\d{2}\/\d{2}\/\d{4}/.test(birthday)) {
    ;[month, day, year] = birthday.split('/')
  } else if (/\d{2}\/\d{2}/.test(birthday)) {
    ;[month, day] = birthday.split('/')
    year = new Date().getFullYear().toString()
  } else if (/\d{4}/.test(birthday)) {
    year = birthday
    month = '01'
    day = '01'
  } else {
    throw new Error('Invalid date format')
  }

  month = month.padStart(2, '0')
  day = day.padStart(2, '0')

  return `${year}-${month}-${day}`
}
