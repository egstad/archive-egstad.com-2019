<template>
  <section class="container">
    <header>
      <h1 class="text--4">#{{ tagTitle }}</h1>
    </header>

    <div class="results" :class="{ 'is-visible': tagsLoaded }">
      <ul v-if="tagItems && tagItems.length" class="text--1">
        <li v-for="(result, index) in tagItems" :key="'result-' + index">
          <nuxt-link :to="'/pieces/' + result.uid">
            {{ result.data.title[0].text }}
          </nuxt-link>
        </li>
      </ul>
      <div v-else class="text--1">
        <hr />
        Nothing is currently tagged "{{ tagTitle }}"
      </div>
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
  data() {
    return {
      tagTitle: null,
      tagId: null,
      tagItems: [],
      tagsLoaded: false,
    }
  },
  asyncData({ payload }) {
    if (payload) {
      return generatePageData('tag', payload)
    } else {
      return initApi().then(api => {
        return api
          .query(Prismic.Predicates.at('document.type', 'tag'))
          .then(response => {
            return generatePageData('tag', response.results)
          })
      })
    }
  },
  beforeMount() {
    this.getTagInfo()
    this.getTaggedItems()
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
    async getTaggedItems() {
      await initApi().then(api => {
        return api
          .query([
            Prismic.Predicates.at('document.type', 'pieces_single'),
            Prismic.Predicates.at('my.pieces_single.tags.tag', this.tagId),
          ])
          .then(response => {
            response.results.forEach(item => {
              this.tagItems.push(item)
            })
          })
      })

      await initApi().then(api => {
        return api
          .query([
            Prismic.Predicates.at('document.type', 'projects_single'),
            Prismic.Predicates.at('my.projects_single.tags.tag', this.tagId),
          ])
          .then(response => {
            response.results.forEach(item => {
              this.tagItems.push(item)
            })
          })
      })

      this.tagsLoaded = true
    },
  },
  // head() {
  //   return this.$setPageMetadata(this.pageContent)
  // },
}
</script>

<style lang="scss" scoped>
.results {
  transition: opacity $trans-duration $trans-ease;
  opacity: 0;
  &.is-visible {
    opacity: 1;
  }
}

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
