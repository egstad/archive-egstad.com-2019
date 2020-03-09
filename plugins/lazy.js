import LazyLoad from 'vanilla-lazyload'

/* ==========================================================================
   LAZYLOAD
   ==========================================================================
   • Once an element enters viewport, load it up!
   • Handles lazyloading images, iframes, scripts, etc...
   • https://github.com/verlok/lazyload
   ========================================================================== */

const lazyload = {
  init() {
    this.options = {
      elements_selector: '.js-lazy',
      class_loading: 'is-loading',
      class_loaded: 'is-loaded',
      class_error: 'is-error',
      thresholds: `${window.innerHeight * 2}px 0%`,
      callback_loaded: el => {
        window.$app.$emit('image::loaded', el)
      },
    }

    // initialize
    this.instance = new LazyLoad(this.options)
  },

  update() {
    this.instance.update()
  },

  destroy() {
    this.instance.destroy()
  },
}

if (process.client) {
  window.onAppReady(app => {
    lazyload.init()

    // update lazy images
    // likely because we just got new assets from prismic
    window.$app.$on('lazy::update', () => {
      window.$app.$nextTick(() => {
        lazyload.update()
      })
    })

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
