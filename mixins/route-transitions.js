import { gsap, Power2 } from 'gsap/all'

export const routeTransitionFade = {
  transition: {
    name: 'page',
    mode: 'out-in',
    css: false,
    beforeEnter(el) {
      this.$store.commit('isTransitioning', 'true')
      gsap.set(el, {
        opacity: 0,
        y: 15,
      })
    },
    enter(el, done) {
      gsap.to(el, 0.5, {
        ease: Power2.easeOut,
        delay: 0.5,
        opacity: 1,
        y: 0,
        onComplete: done,
      })
    },
    leave(el, done) {
      gsap.to(el, 0.3, {
        ease: Power2.easeOut,
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
