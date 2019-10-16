<!--
  This component changes the page theme when its scroll target is hit. The prop
  `fadeTarget` tells the component to either change the theme when the `Target`
  element hits the 'middle' or 'top' of the viewport.

  Because there can be (and are) multiple ThemeScrollChangers on a single page,
  each instance of this component must be able to act alone and in tandem. When
  the component enters the viewport for the first time and while it is still
  below its `fadeTarget` it caches the current page theme once and adds a scroll
  watcher. This scroll watcher is removed once the element leaves the viewport
  so as to not interphere with other instances of this component on the same page.

  Since the theme could have changed multiple times before this component enters
  the viewport we won't know what the before transition theme should be until this
  point. But the component knows what theme it will be changing the page to. So
  once the original theme is cached the component just toggles between the original
  theme and the new theme when the scroll watcher registers that the `fadeTarget`
  has been reached.
-->
<template>
  <div ref="theme" class="theme"></div>
</template>

<style lang="scss" scoped>
.theme {
  display: block;
  height: 1px;
  background: red;
  width: 100%;
}
</style>

<script>
export default {
  props: {
    colors: {
      type: Object,
      required: true,
    },
    fadeTarget: {
      type: String,
      default: 'middle',
    },
  },
  data: () => {
    return {
      isThemeCached: false,
      isBelow: true,
      isFirstLoad: true,
      themeOriginal: null,
      themeNew: null,
    }
  },
  computed: {
    themesAreSame() {
      return (
        JSON.stringify(this.themeOriginal) === JSON.stringify(this.themeNew)
      )
    },
  },
  mounted() {
    const themesOnPage = document.querySelectorAll('.theme')

    // if this theme is first
    if (themesOnPage[0] === this.$refs.theme) {
      console.log('i first')
    } else {
      console.log('i not')
    }

    // cache old theme
    this.themeOriginal = {
      background: this.$app.$store.state.theme.background,
      foreground: this.$app.$store.state.theme.foreground,
      accent: this.$app.$store.state.theme.accent,
    }
    // save new one
    this.themeNew = {
      background: this.colors.background,
      foreground: this.colors.foreground,
      accent: this.colors.accent,
    }
    // compare to see if they match
    // this.themesAreSame =
    //   JSON.stringify(this.themeOriginal) === JSON.stringify(this.themeNew)

    // watch
    this.addObserver()
    // determine what theme to activate on load
    this.onUpdate()
  },
  beforeDestroy() {
    this.loadObserver.unobserve(this.$refs.theme)
  },
  methods: {
    /**
     * Get the Target elements target point in the middle of the screen at its
     * scroll point.
     */
    getTarget() {
      const rect = this.$refs.theme.getBoundingClientRect()

      if (this.fadeTarget === 'top') {
        this.target = rect.top
      } else if (this.fadeTarget === 'middle') {
        this.target = rect.top + window.scrollY - window.innerHeight / 2
      } else if (this.fadeTarget === 'bottom') {
        this.target = rect.top + window.scrollY
      }
    },
    /**
     * Handles Scroll on Animation Frame.
     */
    handleScroll() {
      requestAnimationFrame(this.onUpdate)
    },
    /**
     * Updates the scroll target, caches the current theme if above the target
     * point, and calls toggleTheme.
     */
    onUpdate() {
      this.getTarget()

      if (this.fadeTarget === 'top') {
        if (this.target > 0) {
          this.cacheTheme()
        }

        this.isBelow = this.target > 0
      }

      if (this.fadeTarget === 'middle') {
        // if above theme change point cache the current theme
        if (window.scrollY < this.target) {
          // theme is below
          // console.log('below')
          this.cacheTheme()
        }

        this.isBelow = window.scrollY < this.target
      }

      if (this.fadeTarget === 'bottom') {
        if (this.target > window.scrollY + window.innerHeight) {
          this.cacheTheme()
        }
        this.isBelow = this.target > window.scrollY + window.innerHeight
      }

      this.toggleTheme()
    },
    /**
     * Each component needs to know the page theme that is in effect before they
     * trigger a change so they can handle changing it back. This only needs to
     * happen once per component per page load.
     */
    cacheTheme() {
      if (!this.isThemeCached) {
        this.originalTheme = this.$store.state.theme.themeName
        this.isThemeCached = true
      }
    },
    /**
     * Intersection Observer that trigger when the element enters and exits
     * the viewport.
     */
    addObserver() {
      const IntersectionConfig = {
        threshold: 1,
      }
      this.loadObserver = new IntersectionObserver(
        this.onIntersection,
        IntersectionConfig
      )
      this.loadObserver.observe(this.$refs.theme)
    },
    /**
     * Intersection Observer Intersection Event.
     */
    onIntersection(entries, observer) {
      entries.forEach(entry => {
        // Add the scroll watcher when the component is in the viewport and
        // remove it when its out of the viewport.
        if (entry.intersectionRatio > 0) {
          window.addEventListener('scroll', this.handleScroll)
          // console.log('in')
        } else {
          window.removeEventListener('scroll', this.handleScroll)
          // console.log('out')

          // If the page is loaded with the component already scrolled out of view
          // force a toggle as if the target scroll was hit.
          if (
            this.isFirstLoad &&
            entry.boundingClientRect.top < window.scrollY
          ) {
            this.isBelow = false
            this.cacheTheme()
            this.toggleTheme()
          }
          this.isFirstLoad = false
        }
      })
    },
    /**
     * The page theme is toggled if the scroll is detected to be above or below
     * the target scroll position and if the theme has not already been changed
     * to the new target theme.
     */
    toggleTheme() {
      if (this.isBelow && !this.themesAreSame) {
        console.log('old')
        this.$store.commit('setTheme', this.themeOriginal)
        this.isFirstLoad = false
      } else if (!this.isBelow && !this.themesAreSame) {
        // console.log('new')
        this.$store.commit('setTheme', this.themeNew)
        this.isFirstLoad = false
      }
    },
  },
}
</script>
