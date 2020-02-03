import theme from '@/plugins/theme'
// import dom from '@/plugins/dom'

export const state = () => ({
  // does user have prefers reduced motion enabled?
  prefersReducedMotion: false,
  // check to see if page is transitioning, defaulted to false
  isTransitioning: false,
  // what page are we on?
  activePage: null,
  // menu state
  menuIsOpen: false,
  // theme
  theme: {
    background: 'black',
    foreground: 'white',
    accent: 'blue',
  },

  /**
   * BROWSER MEASUREMENTS
   */
  winWidth: null,
  winHeight: null,
  docWidth: null,
  docHeight: null,

  /**
   * DEVICE INFO
   */
  deviceIsTouch: null,
  deviceIsCursor: null,
  deviceIsMobile: null,
})

export const mutations = {
  // Set menu state
  menuToggle(state, value) {
    if (value) {
      state.menuIsOpen = true
      // window.$app.$emit('filter::close')
    } else {
      state.menuIsOpen = false
    }

    window.$app.$emit('site::blurToggle', state.menuIsOpen)
  },

  /**
   * Set prefers reduced motion state
   */
  prefersReducedMotion(state, boolean) {
    state.prefersReducedMotion = boolean
  },
  /**
   * Set page transitioning state
   */
  isTransitioning(state, val) {
    state.isTransitioning = val
  },
  /**
   * Set active page
   */
  updateActivePage(state, val) {
    state.activePage = val
  },
  /**
   * Dimensions
   */
  setDimensions(state, val) {
    state.winWidth = val.winWidth
    // window height
    state.winHeight = val.winHeight
    // body scroll width
    state.docWidth = val.docWidth
    // body scroll height
    state.docHeight = val.docHeight
  },

  /**
   * Dimensions
   */
  setDevice(state, val) {
    state.deviceIsTouch = val.isTouch
    state.deviceIsCursor = val.isCursor
    state.deviceIsMobile = val.isMobile
  },

  /**
   * Color
   */
  setTheme(state, val) {
    // registered themes come through as strings. theme overrides are objects.
    const isDefinedTheme = typeof val === 'string'

    if (isDefinedTheme) {
      // in use
      // this.$app.$store.commit('setTheme', 'black')

      switch (val) {
        // remember that all colors need to be hex!
        // we convert theses to RGB within the theme.js file
        case 'black':
          state.theme.background = '#0000ff'
          state.theme.foreground = '#ffffff'
          state.theme.accent = '#ffffff'
          break
        case 'white':
          state.theme.background = '#ffffff'
          state.theme.foreground = '#000000'
          state.theme.accent = '#000000'
          break
        default:
          // do nothing
          return
      }
    } else {
      // if author doesn't assign all three colors, the unassigned color remains the same as previous theme
      if (val.background) {
        state.theme.background = val.background
      }
      if (val.foreground) {
        state.theme.foreground = val.foreground
      }
      if (val.accent) {
        state.theme.accent = val.accent
      }
    }

    // update it boi!
    theme.updateColor(state.theme)
  },
}
