import utils from '@/plugins/utils'

const theme = {
  updateColor(options) {
    if (process.client && options.background) {
      const backgroundRgb = utils.hexToRgb(options.background)
      document.documentElement.style.setProperty(
        '--color-background',
        backgroundRgb
      )
    }

    if (process.client && options.foreground) {
      const foregroundRgb = utils.hexToRgb(options.foreground)
      document.documentElement.style.setProperty(
        '--color-foreground',
        foregroundRgb
      )
    }

    if (process.client && options.accent) {
      const accentRgb = utils.hexToRgb(options.accent)
      document.documentElement.style.setProperty('--color-accent', accentRgb)
    }
  },
}

if (process.client) {
  window.onAppReady(app => {
    window.$app.$on('theme::update', theme.updateColor)
  })
}

export default theme
