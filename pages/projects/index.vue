<template>
  <section class="container">
    <h1>{{ title }}</h1>
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
      return generatePageData('projects', context.payload.data)
    } else {
      return initApi().then(api => {
        return api
          .query(Prismic.Predicates.at('document.type', 'projects'))
          .then(response => {
            return generatePageData('home', response.results[0].data)
          })
      })
    }
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
h2 {
  overflow: hidden;
}
a {
  display: block;

  &:hover {
    text-decoration: none;
    color: $color-interactive;
  }
}
</style>
