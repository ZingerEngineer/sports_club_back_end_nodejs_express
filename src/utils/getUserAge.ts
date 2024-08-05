export const getUserAge = (mssqlBirthDate: string) => {
  const currentUTCYear = new Date().getUTCFullYear()
  const mssqlDobYear = mssqlBirthDate.split('-')[0]
  if (mssqlDobYear !== currentUTCYear.toString())
    return currentUTCYear - Number(mssqlDobYear)
  return null
}
