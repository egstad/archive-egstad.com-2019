<template>
  <h2 ref="text" class="logo c12 js-animate animate" @click="reanimate($event)">
    EGSTAD
  </h2>
</template>

<script>
import { gsap, Power2 } from 'gsap/all'
import SplitText from '@/plugins/gsap/SplitText'

export default {
  data() {
    return {
      timeline: null,
      splitText: null,
      splitWrap: null,
      chars: null,
    }
  },
  mounted() {
    this.initGsapSplitText()
    this.loadWhenInView()
  },
  beforeDestroy() {
    this.observer.unobserve(this.$refs.text)
  },
  methods: {
    loadWhenInView() {
      this.observer = new IntersectionObserver(this.onObserverChange)
      this.observer.observe(this.$refs.text)
    },
    initGsapSplitText() {
      // create gsap timeline
      this.timeline = gsap.timeline()
      // split text by characters
      this.splitText = new SplitText(this.$refs.text, {
        type: 'chars',
      })
      // save array of characters
      this.chars = this.splitText.chars

      // register index as dataset
      // we use this in reanimate()
      this.chars.forEach((char, i) => {
        char.setAttribute('data-index', i)
      })
    },
    onObserverChange(entry, observer) {
      if (entry[0].isIntersecting) {
        this.animateText()
        this.observer.unobserve(this.$refs.text)
      }
    },
    animateText() {
      this.timeline.from(
        this.chars,
        {
          duration: 0.8,
          opacity: 0,
          scaleX: '0%',
          transformOrigin: '0% 50% -100%',
          ease: Power2.easeOut,
          stagger: 0.15,
        },
        '+=0'
      )
    },
    reanimate(ev) {
      // which character is clicked? start there
      const startIndex = ev.target.dataset.index
      // number of animations
      const shuffleNum = Math.round(Math.random() * 3)

      switch (shuffleNum) {
        case 0:
          this.animFall(startIndex)
          break
        case 1:
          this.animWave(startIndex)
          break
        case 2:
          this.animSqueeze(startIndex)
          break
        default:
          break
      }
    },
    animFall(startIndex) {
      const plusOrMinus = Math.random() < 0.5 ? -1 : 1

      this.timeline.to(this.chars, {
        duration: 1,
        opacity: 0,
        y: plusOrMinus * 1500,
        rotation: 30,
        skewX: 90,
        transformOrigin: '0% 50% -100%',
        ease: Power2.easeIn,
        stagger: {
          grid: [1, 6],
          from: startIndex,
          axis: 'x',
          each: 0.05,
        },
      })
      this.timeline.set(this.chars, {
        opacity: 0,
        y: 0,
        rotation: 0,
        skewX: 0,
      })
      this.timeline.to(this.chars, {
        duration: 1,
        opacity: 1,
        stagger: {
          grid: [1, 6],
          from: startIndex,
          axis: 'x',
          each: 0.05,
        },
      })
    },
    animWave(startIndex) {
      const y = Math.round(Math.random() * 60) + 10

      this.timeline.to(this.chars, {
        duration: 0.5,
        y: `-${y}%`,
        ease: Power2.easeInOut,
        stagger: {
          grid: [1, 6],
          yoyo: true,
          repeat: 1,
          from: startIndex,
          axis: 'x',
          each: 0.05,
        },
      })
    },
    animSqueeze(startIndex) {
      const rotation = Math.round(Math.random() * 360)
      const plusOrMinus = Math.random() < 0.5 ? -1 : 1

      this.timeline.to(this.chars, {
        duration: 0.5,
        scale: 0.65,
        rotation: plusOrMinus * rotation,
        transformOrigin: 'center center',
        ease: Power2.easeInOut,
        stagger: {
          grid: [1, 6],
          yoyo: true,
          repeat: 1,
          repeatDelay: 0.25,
          from: startIndex,
          axis: 'x',
          each: 0.025,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.logo {
  color: var(--accent);
  font-size: calc(29.7vw - calc(#{$space}));
  line-height: 1;
  white-space: nowrap;
  letter-spacing: -0.08em;
  margin-left: -0.15ch;
  margin-top: calc(10vh + 2vw);
  font-variation-settings: 'wght' 350 !important;
  cursor: pointer;
}

/deep/[data-index='4'] {
  margin-left: -0.15ch;
}
</style>
