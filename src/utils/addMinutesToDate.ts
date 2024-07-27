export const addMinutesToDate = (currentDate: Date, minutes: number) => {
  return new Date(currentDate.setMinutes(currentDate.getMinutes() + minutes))
}
