const dateExp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/

export const validateDate = (date: string) => {
  if (!dateExp.test(date)) return 0
  return 1
}
