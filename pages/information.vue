<!-- pages/index.vue -->

<template>
  <section class="container">
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
