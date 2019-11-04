class Slideshow {
  constructor(el, args) {
    // default options
    this.autoplay = args.autoplay || 0
    this.playing = this.autoplay || 0
    this.duration = args.duration || 1500
    this.classContainer = args.classContainer || 'slides'
    this.classSlide = args.classSlide || 'slide'
    this.classActive = args.classActive || 'is-active'
    this.classTransitioning = args.classTransitioning || 'is-transitioning'
    this.keyControls = args.keyControls === 0 ? args.keyControls : 1
    this.inView = 0
    this.isFocussed = 0
    this.current = args.startSlide || 0
    this.lastActive = 0

    // elements
    this.el = el
    this.slides = this.el.querySelectorAll(`.${this.classSlide}`)
    this.slideContainer = this.el.querySelector(`.${this.classContainer}`)
    this.triggerNext = this.el.querySelector('.js-next')
    this.triggerPrev = this.el.querySelector('.js-prev')
    this.triggerPlay = this.el.querySelector('.js-play')

    // detect transitions
    this.transitionTestEl = window.getComputedStyle(
      this.slides[this.current]
    ).transition
    this.shouldTransition = !this.transitionTestEl.includes('none')

    // binding for handlers
    this.handleNext = this.next.bind(this)
    this.handlePrev = this.prev.bind(this)
    this.handlePlay = this.togglePlay.bind(this)
    this.handleKeys = this.keys.bind(this)
    this.transition = this.transition.bind(this)

    // setup events
    if (this.triggerNext) {
      this.triggerNext.addEventListener('click', this.handleNext)
    }
    if (this.triggerPrev) {
      this.triggerPrev.addEventListener('click', this.handlePrev)
    }
    if (this.triggerPlay) {
      this.triggerPlay.addEventListener('click', this.handlePlay)
    }
    if (this.keyControls) {
      this.el.addEventListener('keyup', this.handleKeys)
    }
    this.slideContainer.addEventListener('click', this.handleNext)

    this.init()
  }
  init() {
    this.slides.forEach((el, i) => {
      el.classList.add(`${this.classSlide}--${i + 1}`)
      el.setAttribute('role', 'group')
      el.setAttribute('aria-roledescription', 'slide')
      el.setAttribute('aria-label', `${i + 1} of ${this.slides.length}`)
      el.tabIndex = 1
    })

    // activate first slide
    this.slides[this.current].classList.add(this.classActive)

    // observe it dude
    // fires up autoplay also
    this.observe()
  }
  observe() {
    this.observer = new IntersectionObserver(item => {
      item.forEach(el => {
        if (el.isIntersecting) {
          // this.inView = 1;
          el.target.classList.add('is-visible')
          // only play when in view
          if (this.autoplay) {
            this.play()
          } else {
            this.stop()
          }
        } else {
          // this.inView = 0;
          el.target.classList.remove('is-visible')
          if (this.autoplay || this.playing) {
            this.stop()
          }
        }
      })
    })

    this.observer.observe(this.el)
  }
  next(ev) {
    // stop autoplay
    if (ev && ev.type === 'click') {
      this.stop()
    }

    // hide ze old one
    this.slides[this.current].classList.remove(this.classActive)
    // update current slade
    this.current = (this.current + 1) % this.slides.length
    // show ze new one
    this.slides[this.current].style.visibility = 'visible'
    this.slides[this.current].classList.add(this.classActive)
    // update focus
    this.updateFocus()

    // let us know when you're done
    if (this.shouldTransition) {
      this.slides[this.current].classList.add(this.classTransitioning)
      this.slides[this.current].addEventListener(
        'transitionend',
        this.transition
      )
    }
  }
  prev(ev) {
    // stop autoplay
    if (ev && ev.type === 'click') {
      this.stop()
    }
    // hide ze old one
    this.slides[this.current].classList.remove(this.classActive)
    // update current slade
    this.current =
      this.current === 0 ? this.slides.length - 1 : this.current - 1
    // show ze new one
    this.slides[this.current].style.visibility = 'visible'
    this.slides[this.current].classList.add(this.classActive)
    // update focus
    this.updateFocus()

    // let us know when you're done
    if (this.shouldTransition) {
      this.slides[this.current].classList.add(this.classTransitioning)
      this.slides[this.current].addEventListener(
        'transitionend',
        this.transition
      )
    }
  }
  updateFocus() {
    if (
      document.activeElement === this.triggerNext ||
      document.activeElement === this.triggerPrev ||
      document.activeElement === this.triggerPlay ||
      this.slideContainer === document.activeElement.parentNode
    ) {
      this.slides[this.current].focus()
    }
  }
  transition(e) {
    this.slides.forEach(slide => {
      slide.classList.remove(this.classTransitioning)
      slide.style.visibility = 'hidden'
    })
    this.slides[this.current].style.visibility = 'visible'
    this.slides[this.current].removeEventListener(
      'transitionend',
      this.transition
    )
  }
  play() {
    this.playing = 1
    this.next()
    this.playingInterval = setInterval(this.handleNext, this.duration)
  }
  stop() {
    this.playing = 0
    clearInterval(this.playingInterval)
  }
  togglePlay() {
    this.playing ? this.stop() : this.play()
  }
  keys(e) {
    // arrow right or tab
    if (e.keyCode === 39) {
      e.preventDefault()
      this.stop()
      this.next()
    }
    // arrow left
    else if (e.keyCode === 37) {
      e.preventDefault()
      this.stop()
      this.prev()
    }
    // enter
    else if (e.keyCode === 13) {
      e.preventDefault()
      this.togglePlay()
    }
    // escape
    else if (e.keyCode === 27) {
      e.preventDefault()
      this.stop()
    }
  }
  destroy() {
    if (this.triggerNext) {
      this.triggerNext.removeEventListener('click', this.handleNext)
    }
    if (this.triggerPrev) {
      this.triggerPrev.removeEventListener('click', this.handlePrev)
    }
    if (this.triggerPlay) {
      this.triggerPlay.removeEventListener('click', this.handlePlay)
    }
    this.el.removeEventListener('keydown', this.handleKeys)
    this.slideContainer.removeEventListener('click', this.handleNext)
    this.observer.unobserve(this.el)
  }
}

export { Slideshow }
