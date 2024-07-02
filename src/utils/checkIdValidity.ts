export const checkIdValidity = (id: string | number) => {
  if (null === id || undefined === id || NaN) return 0
  if (typeof id === 'string') {
    if (Object.is(parseInt(id), NaN)) {
      return 0
    } else {
      return parseInt(id)
    }
  } else {
    return id
  }
}
