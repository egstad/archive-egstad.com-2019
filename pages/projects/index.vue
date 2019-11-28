<template>
  <section class="container">
    <h1>{{ title }}</h1>

    <ul class="project-list">
      <li
        v-for="(project, projectIndex) in projects"
        :key="`project-${projectIndex}`"
        class="project-item"
      >
        <article class="project">
          <n-link :to="project.uid" append>
            <Pic
              :image="project.data.thumbnail_url"
              class="js-animate animate"
            />
          </n-link>

          <TitleAndTags
            class="project-info"
            :title="project.data.title[0].text"
            :tags="project.data.tags"
          />
        </article>
      </li>
    </ul>
  </section>
</template>

<script>
import Prismic from 'prismic-javascript'
import Pic from '@/components/atoms/pic'
import TitleAndTags from '@/components/organism/title-and-tags'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  components: {
    Pic,
    TitleAndTags,
  },
  mixins: [routeTransitionFade],
  data() {
    return {
      isWaitingOnPrismic: false,
    }
  },
  computed: {
    projects() {
      this.$app.$emit('lazy::update')
      return this.$store.state.projects.collection
    },
  },
  async asyncData(context) {
    let prismicResponse = null

    // get projects page data
    await initApi().then(api => {
      return api
        .query(Prismic.Predicates.at('document.type', 'projects'))
        .then(response => {
          // console.log(response)
          prismicResponse = response.results[0].data
        })
    })

    // get project singles!
    await initApi().then(api => {
      return api
        .query(Prismic.Predicates.at('document.type', 'projects_single'), {
          page: context.store.state.projects.pagination.page + 1,
          pageSize: context.store.state.projects.pagination.results_per_page,
          orderings: '[document.first_publication_date]',
        })
        .then(response => {
          const updatedPagination = {
            page: response.page,
            results_per_page: response.results_per_page,
            results_size: response.results_size,
            total_pages: response.total_pages,
            total_results_size: response.total_results_size,
          }

          const newProjects = () => {
            return response.results
          }

          // update pagination data
          // this data helps us fetch the right number of projects
          context.store.commit('projects/updatePagination', updatedPagination)
          // add new projects to store
          context.store.commit('projects/addProjectsToStore', newProjects())
        })
    })

    return generatePageData('projects', prismicResponse)
  },
  created() {
    this.$app.$store.commit('setTheme', {
      background: this.pageContent.background,
      foreground: this.pageContent.foreground,
      accent: this.pageContent.accent,
    })
  },
  mounted() {
    this.$app.$on('projects::loaded', this.updatePrismicThrottle)
    this.$app.$on('scroll::nearBottom', this.infiniteScroll)
    this.$app.$emit('page::mounted')
  },
  methods: {
    updatePrismicThrottle() {
      this.isWaitingOnPrismic = false
    },
    infiniteScroll() {
      if (!this.isWaitingOnPrismic) {
        this.fetchNextPage()
        this.isWaitingOnPrismic = true
      }
    },
    fetchNextPage() {
      this.$store.dispatch('projects/fetchProjects')
    },
  },
  head() {
    return this.$setPageMetadata(this.pageContent)
  },
}
</script>

<style lang="scss" scoped>
.project {
  display: grid;
  justify-content: center;
  width: 100%;

  // wraps all project content
  &-list {
    display: grid;
    justify-content: center;
  }

  // each list item
  &-item {
    max-width: 1800px;
  }

  // wraps figure and title
  &-link {
    display: grid;
    justify-content: center;
    width: 100%;
  }

  // image wrapper
  &-figure {
    max-width: 80vh;
    min-width: 40vw;
    width: 100%;
  }
}
</style>
