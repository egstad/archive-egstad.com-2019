<template>
  <h2 ref="text" class="logo c12 js-animate animate" @click="reanimate($event)">
    EGSTAD
  </h2>
</template>

<script>
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
      this.timeline = window.gsap.timeline()
      // split text by characters
      this.splitText = new window.SplitText(this.$refs.text, {
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
          ease: window.Power2.easeOut,
          stagger: 0.15,
        },
        '+=0'
      )
    },
    reanimate(ev) {
      // which character is clicked? start there
      const startIndex = ev.target.dataset.index
      // stagger is same always
      const stagger = {
        grid: [1, 6],
        from: startIndex,
        axis: 'x',
        each: 0.05,
      }

      // frontFlip
      const frontFlip = {
        duration: 0.5,
        rotation: 360,
        transformOrigin: 'center center',
        ease: window.Power2.easeInOut,
        stagger,
      }

      const squeeze = {
        duration: 0.3,
        scaleY: 0,
        transformOrigin: 'center center',
        ease: window.Power2.easeInOut,
        stagger,
      }
      // squeeze.stagger.repeat = 1
      // squeeze.stagger.yoyo = true

      // wave
      const wave = {
        duration: 0.5,
        y: '-30%',
        ease: window.Power2.easeInOut,
        stagger,
      }
      // wave.stagger.repeat = 1
      // wave.stagger.yoyo = true

      this.animFall(startIndex)

      // const reset = { opacity: 1 }
      // this.timeline.staggerFrom(this.chars, 1.5, reset, 0.06, '+=0')

      // reset
      // this.timeline.to(this.chars, {
      //   scaleY: 1,
      // })
    },
    animFall(startIndex) {
      this.timeline.to(this.chars, {
        duration: 1,
        opacity: 0,
        y: 1500,
        rotation: 30,
        skewX: 90,
        transformOrigin: '0% 50% -100%',
        ease: window.Power2.easeIn,
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
  },
  head() {
    return {
      script: [{ src: 'scripts/gsap/SplitText.min.js' }],
    }
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

/deep/.char5 {
  margin-left: -0.15ch;
}
</style>
