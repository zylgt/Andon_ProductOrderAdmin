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

export function nowTime() {
  var date = new Date()
  var years = date.getFullYear()
  var months = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minu = date.getMinutes()
  var sec = date.getSeconds()
  if (day < 10) {
    day = '0' + day
  }
  if (months < 10) {
    months = '0' + months
  }
  if (hour < 10) {
    hour = '0' + hour
  }
  if (minu < 10) {
    minu = '0' + minu
  }
  if (sec < 10) {
    sec = '0' + sec
  }
  return years + months + day + hour + minu + sec
}
