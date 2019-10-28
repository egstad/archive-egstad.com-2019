const colorWash = {
  init() {
    // get elements
    this.getElementsOnPage()

    // nothing on the page? don't init
    if (!this.targets.length) {
      return
    }

    // event setup
    this.setupEvents()

    // get target positions
    this.getTargetPositions()

    // cache default color
    this.cacheDefaultTheme()
  },
  getElementsOnPage() {
    this.targets = document.querySelectorAll('.scroll-to-theme')
  },
  cacheDefaultTheme() {
    this.cachedTheme = {
      accent: getComputedStyle(document.documentElement).getPropertyValue(
        '--color-accent'
      ),
      background: getComputedStyle(document.documentElement).getPropertyValue(
        '--color-background'
      ),
      foreground: getComputedStyle(document.documentElement).getPropertyValue(
        '--color-foreground'
      ),
    }
  },
  setupEvents() {
    // bind this
    this.onScroll = this.onScroll.bind(this)
    this.onResize = this.onResize.bind(this)

    // check position on scroll
    window.addEventListener('scroll', this.onScroll)

    // update target position on resize & on image load
    window.addEventListener('resize', this.onResize)
    window.$app.$on('image::loaded', this.onResize)
  },
  destroy() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
    window.$app.$off('image::loaded', this.onResize)
  },
  getTargetPositions() {
    this.targetPositions = []

    for (let i = 0; i < this.targets.length; i++) {
      const rect = this.targets[i].getBoundingClientRect()
      const fadeTarget = this.targets[i].dataset.target

      if (fadeTarget === 'top') {
        this.target = rect.y + window.scrollY
      } else if (fadeTarget === 'middle') {
        this.target = rect.y + window.scrollY - window.innerHeight / 2
      } else if (fadeTarget === 'bottom') {
        this.target = rect.y + window.scrollY - window.innerHeight
      }

      this.targetPositions.push(this.target)
    }
  },
  findCurrIndex(nextIndex) {
    let index = null

    if (nextIndex > 0) {
      index = nextIndex - 1
    } else if (nextIndex < 0) {
      index = this.targets.length - 1
    }

    return index
  },
  onScroll() {
    // track scroll position
    this.scrollY = window.scrollY
    // find the closest target that is larger than current scroll position
    this.nextIndex = this.targetPositions.findIndex(nextTargetPosition => {
      return nextTargetPosition > this.scrollY
    })
    // find what index is current
    this.currIndex = this.findCurrIndex(this.nextIndex)

    // in between targets
    if (this.currIndex >= 0 && this.nextIndex) {
      this.setColor(this.currIndex)
    }
    // reset to default color
    else {
      this.setColor(-1)
    }
  },
  setColor(index) {
    const currEl = this.targets[index]

    // update color
    if (index >= 0) {
      this.activeTheme = {
        accent: window.$app.$store.state.theme.accent,
        background: window.$app.$store.state.theme.background,
        foreground: window.$app.$store.state.theme.foreground,
      }
      this.thisTheme = {
        accent: currEl.dataset.accent,
        background: currEl.dataset.background,
        foreground: currEl.dataset.foreground,
      }
    }
    // revert to default
    else {
      this.thisTheme = this.cachedTheme
    }

    const themesMatch =
      JSON.stringify(this.thisTheme) === JSON.stringify(this.activeTheme)

    // if color isn't right, update it
    if (!themesMatch && this.activeTheme) {
      window.$app.$store.commit('setTheme', this.thisTheme)
    }
  },
  onResize() {
    this.getTargetPositions()
  },
}

if (process.client) {
  window.onAppReady(app => {
    colorWash.init()

    // route is changing
    window.$app.$on('route::updated', () => {
      // out with the old
      colorWash.destroy()
    })

    // page is ready!
    window.$app.$on('page::mounted', () => {
      // in with the new
      colorWash.init()
    })
  })
}
