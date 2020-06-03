export function nowDate(type) {
  var date = new Date()
  var years = date.getFullYear()
  var months = date.getMonth() + 1
  var day = date.getDate()
  if (type === 1) {
    months = months - 1
  }
  if (months < 10) {
    months = '0' + months
  }
  if (day < 10) {
    day = '0' + day
  }
  return years + '-' + months + '-' + day
}
