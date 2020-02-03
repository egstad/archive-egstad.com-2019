import FontFaceObserver from 'fontfaceobserver'
// import utils from '@/plugins/utils'

/* ==========================================================================
   FONTS
   ==========================================================================
   • Loads fonts with a promise, returns error if fails
   • Classes are toggled on load/fail
   ========================================================================== */

const fonts = {
  metaphor: new FontFaceObserver('~static/fonts/egmetaphor.ttf', {
    // weight: 400,
    // style: "italic",
    // stretch: "normal"
  }),

  init() {
    this.bindEvents()
    this.loadFonts()
  },

  bindEvents() {
    // emit.on("preload:fonts", function () {
    //     utils.preloadFonts = true;
    //     utils.isPreloadDone();
    // });
  },

  loadFonts() {
    // set state to loading
    document.documentElement.classList.add('fonts-loading')

    // cache font locally
    if (sessionStorage.fontsLoaded) {
      this.fontActivate()
    }
    // if not cached, load her up
    else {
      Promise.all([this.metaphor.load()])
        .then(() => {
          this.fontActivate()
          sessionStorage.fontsLoaded = true
        })
        .catch(() => {
          this.fontDeactivate()
          sessionStorage.fontsLoaded = false
        })
    }
  },

  fontActivate() {
    document.documentElement.classList.remove('fonts-loading')
    document.documentElement.classList.add('fonts-loaded')
    // emit.emit( "preload:fonts" );
  },

  fontDeactivate() {
    document.documentElement.classList.remove('fonts-loading', 'fonts-loaded')
    document.documentElement.classList.add('fonts-failed')
  },
}

if (process.client) {
  window.onAppReady(app => {
    fonts.init()

    // update on new page
    // window.$app.$on('page::mounted', () => {
    //   device.measureWindow()
    // })
  })
}

export default fonts
