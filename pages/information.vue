<!-- pages/index.vue -->

<template>
  <section class="container">
    <Debug />

    <!-- Three JS Faceball. Aka Eggball -->
    <InformationEgball />

    <!-- Logo -->
    <div class="grid">
      <div class="c12">
        <InformationLogo />
        <InformationBio
          text="I guess this is the part where I tell you about myself. How boring. My
        name is Jordan Egstad - I’m an Associate Design Director &amp; Creative
        Developer living in Portland, Oregon. My role is to connect people and
        ideas. No project is too big or too small — I’ve served plumbers,
        political organizations, restaurants, magazines, musicians, fashion
        designers, fashion retailers, banks, non-profits, tech giants, and
        design companies."
        />
      </div>
    </div>

    <!-- Creating a similar space -->
    <div class="space process grid js-animate animate">
      <div class="sm-cap c12 sm-c6 md-c4 text--2 lg-c4 lg-c0">
        I guess this is the part where I tell you about myself. How boring. My
        name is Jordan Egstad - I’m an Associate Design Director &amp; Creative
        Developer living in Portland, Oregon. My role is to connect people and
        ideas. No project is too big or too small — I’ve served plumbers,
        political organizations, restaurants, magazines, musicians, fashion
        designers, fashion retailers, banks, non-profits, tech giants, and
        design companies.
      </div>
      <div
        class="sm-cap c12 sm-c6 sm-start-c7 md-c4 md-start-c5 lg-c4 lg-c0 text--2 space-t2"
      >
        I guess this is the part where I tell you about myself. How boring. My
        name is Jordan Egstad - I’m an Associate Design Director &amp; Creative
        Developer living in Portland, Oregon. My role is to connect people and
        ideas. No project is too big or too small — I’ve served plumbers,
        political organizations, restaurants, magazines, musicians, fashion
        designers, fashion retailers, banks, non-profits, tech giants, and
        design companies.
      </div>
      <div
        class="sm-cap c12 c-align-start sm-c6 sm-start-c7 md-c4 md-start-c5 lg-c4 lg-c0 text--2 space-t2"
      ></div>
    </div>

    <InformationFilm ref="film" class="fence" :video="pageContent.video.url" />

    <Slices :slices="pageContent.body" />
  </section>
</template>

<script>
import Prismic from 'prismic-javascript'
import utils from '@/plugins/utils'
import InformationLogo from '@/components/organism/information-logo'
import InformationBio from '@/components/organism/information-bio'
import InformationFilm from '@/components/organism/information-film'
import InformationEgball from '@/components/organism/information-egball'
import Debug from '@/components/templates/debug'
import Slices from '@/components/templates/slices'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  components: {
    Slices,
    Debug,
    InformationLogo,
    InformationBio,
    InformationFilm,
    InformationEgball,
  },
  mixins: [routeTransitionFade],
  data() {
    return {
      themes: [
        {
          foreground: '#FFFFFF', // white
          background: '#FF90BD', // pink
          accent: '#FF0200', // red
        },
        {
          foreground: '#FF1AC2', // magenta
          background: '#FEFE00', // yellow
          accent: '#FF1AC2', // magenta
        },
        {
          foreground: '#1F201E', // charcoal
          background: '#EBE3D8', // gray
          accent: '#0599FF', // blue
        },
        {
          foreground: '#107A49', // forrest
          background: '#E7EBEE', // gray
          accent: '#FFAA00', // yellow
        },
      ],
      themeCurrentIndex: 0,
    }
  },
  asyncData(context) {
    if (context.payload) {
      return generatePageData('information', context.payload.data)
    } else {
      return initApi().then(api => {
        return api
          .query(Prismic.Predicates.at('document.type', 'information'))
          .then(response => {
            return generatePageData('information', response.results[0].data)
          })
      })
    }
  },
  created() {
    this.shuffleThemes()
    this.setRandomTheme()
    // this.$app.$store.commit('setTheme', {
    //   background: this.pageContent.background,
    //   foreground: this.pageContent.foreground,
    //   accent: this.pageContent.accent,
    // })
  },
  mounted() {
    this.$app.$emit('page::mounted')
  },
  beforeDestroy() {
    this.$app.$off('page::resized')
    // kill the animation loop
    cancelAnimationFrame(this.raf)
    // teardown resize event
    window.removeEventListener('resize', this.onWindowResize)
    // window.removeEventListener('mousemove', this.onMouseMove)
    // this.$app.$off('updatePosition')
    clearInterval(this.meshMoveInterval)
  },
  methods: {
    shuffleThemes() {
      const shuffledThemes = utils.shuffle(this.themes)
      this.themes = shuffledThemes
    },
    setRandomTheme() {
      this.$app.$store.commit('setTheme', {
        background: this.themes[this.themeCurrentIndex].background,
        foreground: this.themes[this.themeCurrentIndex].foreground,
        accent: this.themes[this.themeCurrentIndex].accent,
      })

      this.themeCurrentIndex++
    },
  },
  head() {
    return this.$setPageMetadata(this.pageContent)
  },
}
</script>
