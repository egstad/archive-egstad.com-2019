const utils = {
  getTitleCase(str) {
    str = str.toLowerCase().split(' ')
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1)
    }
    return str.join(' ')
  },
  getRandomInt(min, max) {
    return Math.floor(Math.random() * max) + min
  },
  shuffle(array) {
    for (let i = array.length; i > 1; i--) {
      const r = Math.floor(Math.random() * i)
      const temp = array[r]
      array[r] = array[i - 1]
      array[i - 1] = temp
    }
    return array
  },
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : null
  },
}

export default utils
