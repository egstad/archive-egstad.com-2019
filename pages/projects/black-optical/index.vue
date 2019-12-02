<template>
  <article class="container">
    <header>
      <h1 class="text--5">{{ title }}</h1>

      <div class="grid">
        <h1 class="c10 sm-c8 md-c5 lg-c4 xl-c3 text--6">
          Hello there world how are we doing
        </h1>
        <p
          class="c12 sm-c6 md-start-c7 lg-c3 lg-start-c7 xl-c2 xl-start-c5 text--4"
        >
          {{ pageContent.body[0].items[0].content[0].text }}
        </p>
        <p
          class="c12 sm-c6 md-start-c7 lg-c3 lg-start-c10 xl-c2 xl-start-c7 text--4"
        >
          {{ pageContent.body[0].items[1].content[0].text }}
        </p>
        <img
          class="c12 md-c6 md-start-c7 xl-start-c9 xl-c4"
          alt
          src="//placehold.it/800"
        />
      </div>
    </header>

    <Pic
      :image="pageContent.body[1].primary.image"
      class="js-animate animate"
    />
  </article>
</template>

<script>
/* eslint-disable */
import grid from '@/assets/scss/grid.scss'
/* eslint-enable */
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
