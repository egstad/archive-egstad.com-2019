<!-- pages/index.vue -->

<template>
  <section class="container">
    <Debug />

    <div class="grid">
      <h1 class="logo c12">EGSTAD</h1>

      <p class="para c12">
        I guess this is the part where I tell you about myself. How boring. My
        name is Jordan Egstad - I’m an Associate Design Director &amp; Creative
        Developer living in Portland, Oregon. My role is to connect people and
        ideas. No project is too big or too small — I’ve served plumbers,
        political organizations, restaurants, magazines, musicians, fashion
        designers, fashion retailers, banks, non-profits, tech giants, and
        design companies.
      </p>
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
    </div>

    <Slices :slices="pageContent.body" />
  </section>
</template>

<script>
/* eslint-disable */
import Prismic from 'prismic-javascript'
import grid from '@/assets/scss/grid.scss'
import Debug from '@/components/templates/debug'
/* eslint-enable */
import Slices from '@/components/templates/slices'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  components: {
    Slices,
    Debug,
  },
  mixins: [routeTransitionFade],
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
    this.$app.$store.commit('setTheme', {
      background: this.pageContent.background,
      foreground: this.pageContent.foreground,
      accent: this.pageContent.accent,
    })
  },
  mounted() {
    this.$app.$emit('page::mounted')
  },
  head() {
    return this.$setPageMetadata(this.pageContent)
  },
}
</script>

<style lang="scss" scoped>
// $grid-gutters: calc(20px + 0.5vw);

.logo {
  font-size: 27.5vw;
  white-space: nowrap;
  letter-spacing: -0.08em;
  transform: translateX(-0.1em);
  margin-top: 20vw;
  margin-top: calc(200px + 10vw);
  // padding: 0 calc(#{$grid-gutters} * 0.5 + 4vw);
  font-variation-settings: 'wght' 100 !important;
}

.para {
  font-family: 'TimesNow-SemiLight';
  font-family: 'LLBradford-Light';
  letter-spacing: -0.04em;
  line-height: 1.1;
  font-size: 3.75vw;
  // font-style: italic;
}
</style>
