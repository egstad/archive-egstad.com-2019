<template>
  <header>
    <p ref="text" class="para js-animate animate">{{ text }}</p>
  </header>
</template>

<script>
import { gsap, Power2 } from 'gsap/all'
import SplitText from '@/plugins/gsap/SplitText'

export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      timeline: null,
      splitText: null,
      splitWrap: null,
      chars: null,
      lines: null,
    }
  },
  mounted() {
    this.timeline = gsap.timeline()
    this.splitText = new SplitText(this.$refs.text, {
      type: 'lines',
      linesClass: 'line-child',
    })
    this.splitWrap = new SplitText(this.$refs.text, {
      type: 'lines',
      linesClass: 'line-parent hidden',
    })
    this.lines = this.splitText.lines

    // watch if in view
    this.observer = new IntersectionObserver(this.onObserverChange)
    this.observer.observe(this.$refs.text)
  },
  beforeDestroy() {
    this.observer.unobserve(this.$refs.text)
  },
  methods: {
    onObserverChange(entry, observer) {
      if (entry[0].isIntersecting) {
        this.animateText()
        this.observer.unobserve(this.$refs.text)
      }
    },
    animateText() {
      this.timeline.from(
        '.line-child',
        {
          duration: 0.8,
          opacity: 0,
          y: '100%',
          ease: Power2.easeOut,
          stagger: 0.15,
          onComplete: () => {
            // split in reverse order of initialization
            this.splitWrap.revert()
            this.splitText.revert()
          },
        },
        '+=0'
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.para {
  font-family: 'TimesNow-SemiLight';
  font-family: 'LLBradford-Light';
  letter-spacing: -0.04em;
  line-height: 1.1;
  font-size: 3.75vw;
}
</style>
