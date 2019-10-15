<template>
  <section class="container">
    <!-- <pre>{{ pageContent }}</pre> -->
    <h1 class="text--5">{{ title }}</h1>

    <div v-for="(tag, index) in pageContent[0].results" :key="'tag-' + index">
      <h2 class="text--3">{{ tag.name }}</h2>

      <ul
        v-for="(item, itemIndex) in pageContent[1].results"
        :key="'tag-' + itemIndex"
      >
        <li v-if="item.tag === tag.name">
          <hr />
          <nuxt-link :to="`${item.type}s/${item.uid}`">
            <span class="text--mono">{{ item.type }} — </span>
            <span>{{ item.title }}</span>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import Prismic from 'prismic-javascript'
import utils from '@/plugins/utils'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  mixins: [routeTransitionFade],
  async asyncData({ payload }) {
    /**
     * 1. Fetch all tags
     * 2. Fetch all pieces and projects tagged as 'i'
     */

    // keep track of tags
    const tags = {
      name: 'tags',
      results: [],
    }

    // keep track of tagged content
    const content = {
      name: 'results',
      results: [],
    }

    // fetch all tags
    await initApi().then(api => {
      return api
        .query(Prismic.Predicates.at('document.type', 'tag'))
        .then(response => {
          // lets tidy up this data
          for (const tag of response.results) {
            const itemData = {
              name: tag.data.tag,
              type: tag.type,
              id: tag.id,
            }

            tags.results.push(itemData)
          }
        })
    })

    // Asynchronously fetch all pieces for all tags
    const fetchPiecesFromPrismic = async () => {
      for (let index = 0; index < tags.results.length; index++) {
        await getAllPiecesTaggedAs(tags.results[index])
      }
    }

    // Asynchronously fetch all projects for all tags
    const fetchProjectsFromPrismic = async () => {
      for (let index = 0; index < tags.results.length; index++) {
        await getAllProjectsTaggedAs(tags.results[index])
      }
    }

    // fetch all posts from a specific tag
    const getAllPiecesTaggedAs = async tag => {
      await initApi().then(api => {
        return api
          .query([
            Prismic.Predicates.at('document.type', 'pieces_single'),
            Prismic.Predicates.at('my.pieces_single.tags.tag', tag.id),
          ])
          .then(response => {
            // lets tidy up this data
            for (const item of response.results) {
              const itemData = {
                type: 'piece',
                tag: tag.name,
                title: item.data.title[0].text,
                uid: item.uid,
              }

              content.results.push(itemData)
            }
          })
      })
    }

    // fetch all posts from a specific tag
    const getAllProjectsTaggedAs = async tag => {
      await initApi().then(api => {
        return api
          .query([
            Prismic.Predicates.at('document.type', 'projects_single'),
            Prismic.Predicates.at('my.projects_single.tags.tag', tag.id),
          ])
          .then(response => {
            // lets tidy up this data
            for (const item of response.results) {
              const itemData = {
                type: 'project',
                tag: tag.name,
                // tags: item.data.tags,
                title: item.data.title[0].text,
                uid: item.uid,
              }
              content.results.push(itemData)
            }
          })
      })
    }

    await fetchPiecesFromPrismic()
    await fetchProjectsFromPrismic()
    return generatePageData('tags', [tags, content])
  },
  beforeMount() {
    // this.getTagInfo()
    // this.getTaggedItems()
    // this.getAllTags()
  },
  mounted() {
    this.$app.$emit('page::mounted')
    console.log(this.$data)
  },
  methods: {
    getTagInfo() {
      // find this name and id
      // save it for later
      this.pageContent.find(el => {
        if (el.data.tag === this.$route.params.slug) {
          this.tagTitle = utils.getTitleCase(el.data.tag)
          this.tagId = el.id
        }
      })
    },
    getTaggedItems() {
      initApi().then(api => {
        return api
          .query([
            Prismic.Predicates.at('document.type', 'pieces_single'),
            Prismic.Predicates.at('my.pieces_single.tags.tag', this.tagId),
          ])
          .then(response => {
            this.tagItems = response.results
            this.tagsLoaded = true
          })
      })
    },
  },
  // head() {
  //   return this.$setPageMetadata(this.pageContent)
  // },
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
