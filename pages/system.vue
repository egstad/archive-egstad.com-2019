<template>
  <article class="container">
    <Debug />

    <section class="section typography grid">
      <header class="c12"><h2 class="text--1">typography</h2></header>

      <div class="c12 grid grid-- grid--full">
        <div class="text--1 c6 sm-c4 md-c3 lg-c2 xl-c2">
          Because the quizzical twins proved my hijack-bug, will you please pack
          my box with five dozen liquor jugs? Because the quizzical twins proved
          my hijack-bug, will you please pack my box with five dozen liquor
          jugs?
        </div>
        <div class="text--3 c10 sm-c8 sm-start-c1 md-c6 lg-start-c3 lg-c3">
          Because the quizzical twins proved my hijack-bug, will you please pack
          my box with five dozen liquor jugs? Because the quizzical twins proved
          my hijack-bug, will you please pack my box with five dozen liquor
          jugs? Because the quizzical twins proved my hijack-bug, will you
          please pack my box with five dozen liquor jugs? Because the quizzical
          twins proved my hijack-bug, will you please pack my box with five
          dozen liquor jugs?
        </div>
        <div class="text--4 c12 sm-c10 md-c8 lg-start-c6 lg-c3">
          Because the quizzical twins proved my hijack-bug, will you please pack
          my box with five dozen liquor jugs? Because the quizzical twins proved
          my hijack-bug, will you please pack my box with five dozen liquor
          jugs? Because the quizzical twins proved my hijack-bug, will you
          please pack my box with five dozen liquor jugs? Because the quizzical
          twins proved my hijack-bug, will you please pack my box with five
          dozen liquor jugs?
        </div>
        <div class="text--5 c12 md-c10 lg-start-c9 lg-c5">
          Because the quizzical twins proved my hijack-bug, will you please pack
          my box with five dozen liquor jugs? Because the quizzical twins proved
          my hijack-bug, will you please pack my box with five dozen liquor
          jugs?
        </div>
        <!-- <div class="text--6 c12 sm-c6 md-c4 lg-c3 xl-c2">
          Because the quizzical twins proved my hijack-bug, will you please pack
          my box with five dozen liquor jugs? Because the quizzical twins proved
          my hijack-bug, will you please pack my box with five dozen liquor
          jugs? Because the quizzical twins proved my hijack-bug, will you
          please pack my box with five dozen liquor jugs? Because the quizzical
          twins proved my hijack-bug, will you please pack my box with five
          dozen liquor jugs?
        </div> -->
      </div>
    </section>

    <!-- <div class="grid">
      <h1 class="c10 sm-c8 md-c5 lg-c4 xl-c3 text--6">
        Hello there world how are we doing
      </h1>
      <p
        class="c12 sm-c6 md-start-c7 lg-c3 lg-start-c7 xl-c2 xl-start-c5 text--4"
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
      <p
        class="c12 sm-c6 md-start-c7 lg-c3 lg-start-c10 xl-c2 xl-start-c7 text--4"
      >
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <img
        class="c12 md-c6 md-start-c7 xl-start-c9 xl-c4"
        alt
        src="//placehold.it/800"
      />
    </div> -->

    <Slices :slices="pageContent.body" />
  </article>
</template>

<script>
import Debug from '@/components/templates/debug'
import Slices from '@/components/templates/slices'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  components: {
    Debug,
    Slices,
  },
  mixins: [routeTransitionFade],
  asyncData(context) {
    return initApi().then(api => {
      return api.getByUID('page', 'system').then(response => {
        return generatePageData('page', response.data)
      })
    })
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
.section {
  margin-top: 11px * 12;
  margin-bottom: 11px * 12;

  header {
    width: 100%;
    padding-bottom: 7px;
    border-bottom: 1px solid var(--foreground);
    margin-bottom: 11px * 2;
  }
}

img {
  display: block;
  width: 100%;
}
</style>
