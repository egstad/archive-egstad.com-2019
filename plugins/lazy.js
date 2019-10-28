import LazyLoad from 'vanilla-lazyload'

/* ==========================================================================
   LAZYLOAD
   ==========================================================================
   • Once an element enters viewport, load it up!
   • Handles lazyloading images, iframes, scripts, etc...
   • https://github.com/verlok/lazyload
   ========================================================================== */

const lazyload = {
  loadTimeout: null,
  elemsInDoc: document.querySelectorAll('.js-lazy'),
  elemsInView: [],

  init() {
    this.bindEvents()
    this.options = {
      elements_selector: '.js-lazy',
      class_loading: 'is-loading',
      class_loaded: 'is-loaded',
      class_error: 'is-error',
    }

    // initialize
    this.instance = new LazyLoad(this.options)
    // find images in view
    this.getImagesInView()
  },

  bindEvents() {
    // emit.on('preload:lazyItems', function() {
    //   // tell app that images are loaded
    //   utils.preloadLazyItems = true
    //   // ask app if everything else is loaded
    //   // if so, close the intro
    //   utils.isPreloadDone()
    // })
  },

  destroy() {
    this.instance.destroy()
  },
}

if (process.client) {
  window.onAppReady(app => {
    lazyload.init()

    // route is changing
    window.$app.$on('route::updated', () => {
      // out with the old
      lazyload.destroy()
    })

    // page is ready!
    window.$app.$on('page::mounted', () => {
      // in with the new
      lazyload.init()
    })
  })
}

export default lazyload
