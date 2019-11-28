<template>
  <article class="container">
    <header>
      <h1 class="text--5">{{ title }}</h1>
      <div>
        <prismic-rich-text :field="pageContent.body[0].items[0].content" />
        <prismic-rich-text :field="pageContent.body[0].items[1].content" />
      </div>
    </header>

    <Pic
      :image="pageContent.body[1].primary.image"
      class="js-animate animate"
    />
  </article>
</template>

<script>
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'
import Pic from '@/components/atoms/pic'

export default {
  components: {
    Pic,
  },
  mixins: [routeTransitionFade],
  asyncData(context) {
    if (context.payload) {
      return generatePageData('projects_single', context.payload.data)
    } else {
      return initApi().then(api => {
        return api
          .getByUID('projects_single', 'black-optical')
          .then(response => {
            return generatePageData('projects_single', response.data)
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
    console.log(this.pageContent)
  },
  head() {
    return this.$setPageMetadata(this.pageContent)
  },
}
</script>
