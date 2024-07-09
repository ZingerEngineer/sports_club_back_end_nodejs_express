const timeRegEx = /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]).([0-9]{3})$/
export const validateTime = (time: string) => {
  if (!timeRegEx.test(time)) return 0
  return 1
}
