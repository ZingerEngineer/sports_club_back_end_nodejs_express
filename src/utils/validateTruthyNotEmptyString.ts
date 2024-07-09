export const validateTruthyNotEmptyString = (stringInput: string) => {
  if (typeof stringInput !== 'string' || (!stringInput && stringInput !== ''))
    return 0
  return 1
}
