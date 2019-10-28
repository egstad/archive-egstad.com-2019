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
    // save it
    if (val.background) {
      state.theme.background = val.background
    }
    if (val.foreground) {
      state.theme.foreground = val.foreground
    }
    if (val.accent) {
      state.theme.accent = val.accent
    }

    // update it boi!
    theme.updateColor(val)
  },
}
