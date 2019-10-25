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
          <nuxt-link :to="project.uid" append class="project-link">
            <figure class="project-figure">
              <Pic :image="project.thumbnail" class="js-animate animate" />
            </figure>
            <h2>{{ project.title[0].text }}</h2>
          </nuxt-link>

          <ul class="project-tag-list">
            <li
              v-for="(tag, tagIndex) in project.tags"
              :key="`tag-${tagIndex}`"
              class="project-tag-item"
            >
              <nuxt-link :to="`tags/${tag.tag.slug}`" class="project-tag-link">
                {{ tag.tag.slug }}
              </nuxt-link>
            </li>
          </ul>
        </article>
      </li>
    </ul>
  </section>
</template>

<script>
import Prismic from 'prismic-javascript'
import Pic from '@/components/atoms/pic'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  components: {
    Pic,
  },
  mixins: [routeTransitionFade],
  async asyncData(context) {
    /**
     * 1. Fetch all tags
     * 2. Fetch all pieces and projects tagged as 'i'
     */

    // keep track of projects data
    const projectsData = {
      name: 'projects',
      results: [],
    }

    // keep track of project_single's data
    const projectSinglesData = {
      name: 'project_single',
      results: [],
      uids: [],
    }

    // fetch all projects data
    // including uids of ordered projects on within the 'projects' page
    await initApi().then(api => {
      return api
        .query(Prismic.Predicates.at('document.type', 'projects'))
        .then(response => {
          // grab the uid from prismic
          for (const projectData of response.results[0].data.projects) {
            const uid = projectData.project.uid

            // add to uids, we'll loop through them soon
            projectSinglesData.uids.push(uid)
          }

          // capture response
          const projectsResponse = response.results[0].data
          // delete data because we don't need it
          delete projectsResponse.projects
          // update results
          projectsData.results = projectsResponse
        })
    })

    // Asynchronously fetch all pieces for all tags
    const fetchProjectsFromPrismic = async () => {
      for (let index = 0; index < projectSinglesData.uids.length; index++) {
        await getAllProjectData(projectSinglesData.uids[index])
      }
    }

    // fetch all posts from a specific tag
    const getAllProjectData = async projectUID => {
      await initApi().then(api => {
        api.getByUID('projects_single', projectUID).then(response => {
          // console.log(response)
          // lets tidy up this data
          const itemData = {
            title: response.data.title,
            thumbnail: response.data.thumbnail_url,
            tags: response.data.tags,
            uid: response.uid,
          }

          projectSinglesData.results.push(itemData)
        })
      })
    }

    await fetchProjectsFromPrismic()
    return generatePageData('projects', [projectsData, projectSinglesData])
  },
  created() {
    this.$app.$store.commit('setTheme', {
      background: this.pageContent.background,
      foreground: this.pageContent.foreground,
      accent: this.pageContent.accent,
    })
  },
  mounted() {
    // console.log(this.pageContent)
    this.$app.$emit('page::mounted')
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
