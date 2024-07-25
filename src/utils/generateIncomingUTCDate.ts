export const addMinutesToDate = (currentDate: Date, minutes: number) => {
  return new Date(currentDate.setMinutes(currentDate.getMinutes() + minutes))
}

export const getMssqlUTCTimeStamp = (currentTimeStamp: Date) => {
  const dateIsoStringArray = currentTimeStamp.toISOString().split('T')
  return (
    dateIsoStringArray[0] +
    ' ' +
    dateIsoStringArray[1].slice(0, dateIsoStringArray[1].length - 1)
  )
}

export const getJSIsoStringFromMssqlTimeStamp = (mssqlTimeStamp: string) => {
  const splitArray = mssqlTimeStamp.split(' ')
  return splitArray[0] + 'T' + splitArray[1].split('.')[0] + 'Z'
}
