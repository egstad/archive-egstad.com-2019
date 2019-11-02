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
          <Pic :image="project.data.thumbnail_url" class="js-animate animate" />

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

    await initApi().then(api => {
      return api
        .query(Prismic.Predicates.at('document.type', 'projects'))
        .then(response => {
          prismicResponse = response.results[0].data
        })
    })
    return generatePageData('projects', prismicResponse)
  },
  fetch({ store }) {
    store.dispatch('projects/fetchProjects')
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

    console.log(this.pageContent)
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
      this.$store.dispatch('pieces/fetchPieces')
    },
  },
  head() {
    return this.$setPageMetadata(this.pageContent)
  },
}
</script>

<style lang="scss" scoped>
.project {
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
