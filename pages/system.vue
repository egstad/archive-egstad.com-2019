<template>
  <article class="container">
    <header>
      <h1 class="text--5">{{ title }}s</h1>
    </header>

    <Slices :slices="pageContent.body" />
  </article>
</template>

<script>
import Slices from '@/components/templates/slices'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  components: {
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
  mounted() {
    this.$app.$emit('page::mounted')
  },
  head() {
    return this.$setPageMetadata(this.pageContent)
  },
}
</script>
