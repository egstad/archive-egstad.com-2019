<template>
  <div class="container">
    <h1 class="text--5">{{ title }}</h1>

    <Slices :slices="pageContent.body" />
  </div>
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
      return generatePageData('projects_single', context.payload.data)
    } else {
      return initApi().then(api => {
        return api
          .query(
            Prismic.Predicates.at('my.projects_single.uid', context.params.slug)
          )
          .then(response => {
            return generatePageData('pieces_single', response.results[0].data)
          })
      })
    }
  },
  mounted() {
    this.$app.$emit('page::mounted')

    console.log(this.pageContent)
  },
  head() {
    return this.$setPageMetadata(this.pageContent)
  },
}
</script>
