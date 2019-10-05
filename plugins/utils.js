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
}

export default utils
