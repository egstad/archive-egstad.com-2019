export const routeTransitionFade = {
  transition: {
    name: 'page',
    mode: 'out-in',
    css: false,
    beforeEnter(el) {
      this.$store.commit('isTransitioning', 'true')
      window.TweenLite.set(el, {
        opacity: 0,
        y: 15,
      })
    },
    enter(el, done) {
      window.TweenLite.to(el, 0.5, {
        ease: window.Power2.easeOut,
        delay: 0.5,
        opacity: 1,
        y: 0,
        onComplete: done,
      })
    },
    leave(el, done) {
      window.TweenLite.to(el, 0.3, {
        ease: window.Power2.easeOut,
        opacity: 0,
        y: 15,
        onComplete: done,
      })
    },
    afterLeave() {
      this.$store.commit('isTransitioning', 'false')
    },
  },
}
