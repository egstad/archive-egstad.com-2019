<template>
  <article class="container">
    <header>
      <h1 class="text--5">{{ title }}</h1>
    </header>

    <Slices :slices="pageContent.body" />
  </article>
</template>

<script>
import Prismic from 'prismic-javascript'
import Slices from '@/components/templates/slices'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  components: {
    Slices,
  },
  mixins: [routeTransitionFade],
  asyncData(context) {
    if (context.payload) {
      return generatePageData('pieces_single', context.payload.data)
    } else {
      return initApi().then(api => {
        return api
          .query(
            Prismic.Predicates.at('my.pieces_single.uid', context.params.slug)
          )
          .then(response => {
            return generatePageData('pieces_single', response.results[0].data)
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
