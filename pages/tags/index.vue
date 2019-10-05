<template>
  <section class="container">
    <!-- <pre>{{ pageContent }}</pre> -->
    <h1 class="text--5">{{ title }}</h1>

    <div v-for="(tag, index) in pageContent" :key="'tag-' + index">
      <hr />
      <h2 class="text--4">
        <nuxt-link :to="`/tags/` + tag.title">{{ tag.title }}</nuxt-link>
      </h2>
      <hr />
      <ul>
        <li v-for="result in tag.results" :key="result.id" class="text--2">
          <nuxt-link :to="`/pieces/` + result.uid">{{
            result.data.title[0].text
          }}</nuxt-link>
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
    let tags = []
    const results = []

    // fetch all tags
    await initApi().then(api => {
      return api
        .query(Prismic.Predicates.at('document.type', 'tag'))
        .then(response => {
          tags = response.results
        })
    })

    // Asynchronously fetch all posts for all tags
    const fetchPostsFromPrismic = async () => {
      for (let index = 0; index < tags.length; index++) {
        await getPostsTaggedAs(tags[index])
      }
    }

    // fetch all posts from a specific tag
    const getPostsTaggedAs = async tag => {
      await initApi().then(api => {
        return api
          .query([
            Prismic.Predicates.at('document.type', 'pieces_single'),
            Prismic.Predicates.at('my.pieces_single.tags.tag', tag.id),
          ])
          .then(response => {
            // add title to response
            // prismic doesn't include it
            response.title = tag.data.tag
            results.push(response)
            return response
          })
      })
    }

    await fetchPostsFromPrismic()
    return generatePageData('tags', results)
  },
  beforeMount() {
    // this.getTagInfo()
    // this.getTaggedItems()
    // this.getAllTags()
  },

  mounted() {
    this.$app.$emit('page::mounted')
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
