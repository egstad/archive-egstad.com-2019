<!-- pages/index.vue -->

<template>
  <section class="container spacing-top-5">
    <header class="">
      <h1>{{ title }}</h1>
    </header>
  </section>
</template>

<script>
import Prismic from 'prismic-javascript'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  mixins: [routeTransitionFade],
  asyncData(context) {
    if (context.payload) {
      return generatePageData('home', context.payload.data)
    } else {
      return initApi().then(api => {
        return api
          .query(Prismic.Predicates.at('document.type', 'home'))
          .then(response => {
            return generatePageData('home', response.results[0].data)
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
    // set the page label
    this.$app.$emit('page::setLabel', 'EGSTAD')
    this.$app.$emit('page::mounted')
  },
  head() {
    return this.$setPageMetadata(this.pageContent)
  },
}
</script>

<style lang="scss">
.wrap {
  max-width: 800px;
}
</style>
