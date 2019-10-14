<template>
  <section class="container">
    <h1>{{ title }}</h1>

    <ul>
      <li
        v-for="(project, projectIndex) in projects"
        :key="`project-${projectIndex}`"
        class="text--2"
      >
        <nuxt-link :to="project.uid" append>{{ project.title }}</nuxt-link>
      </li>
    </ul>
  </section>
</template>

<script>
import Prismic from 'prismic-javascript'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  mixins: [routeTransitionFade],
  async asyncData(context) {
    if (context.payload) {
      await generatePageData('projects', context.payload.data)
    } else {
      const projectsData = []
      await initApi().then(api => {
        return api
          .query(Prismic.Predicates.at('document.type', 'projects'))
          .then(response => {
            projectsData.push(response.results[0].data)
          })
      })
      await initApi().then(api => {
        return api
          .query(Prismic.Predicates.at('document.type', 'projects_single'), {
            orderings: '[document.first_publication_date]',
          })
          .then(response => {
            const cleanData = []

            // lets tidy up this data
            for (const item of response.results) {
              const itemData = {
                title: item.data.title[0].text,
                tags: item.data.tags,
                uid: item.uid,
              }

              cleanData.push(itemData)
            }
            projectsData.push(cleanData)
          })
      })

      return generatePageData('projects', projectsData)
    }
  },
  mounted() {
    this.$app.$emit('page::mounted')
    console.log(this.$data)
  },
  head() {
    return this.$setPageMetadata(this.pageContent[0])
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
