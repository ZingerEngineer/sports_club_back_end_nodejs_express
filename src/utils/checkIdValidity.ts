export const checkIdValidity = (id: string | number) => {
  if (null === id || undefined === id || NaN) return 0
  if (typeof id === 'string') {
    if (Object.is(parseInt(id), NaN)) return 0
    if (!Number.isInteger(Number(id))) return 0
    return { id: parseInt(id), valid: 1 }
  } else {
    if (!Number.isInteger(id)) return 0
    return { id, valid: 1 }
  }
}
