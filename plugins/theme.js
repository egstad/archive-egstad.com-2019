const theme = {
  updateColor(options) {
    if (process.client && options.background) {
      document.documentElement.style.setProperty(
        '--color-background',
        options.background
      )
    }

    if (process.client && options.foreground) {
      document.documentElement.style.setProperty(
        '--color-foreground',
        options.foreground
      )
    }

    if (process.client && options.accent) {
      document.documentElement.style.setProperty(
        '--color-accent',
        options.accent
      )
    }
  },
}

if (process.client) {
  window.onAppReady(app => {
    window.$app.$on('theme::update', theme.updateColor)
  })
}

export default theme
