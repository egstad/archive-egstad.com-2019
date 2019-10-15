const theme = {
  updateColor(options) {
    if (options.background) {
      document.documentElement.style.setProperty(
        '--color-background',
        options.background
      )
    }

    if (options.foreground) {
      document.documentElement.style.setProperty(
        '--color-foreground',
        options.foreground
      )
    }

    if (options.accent) {
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
