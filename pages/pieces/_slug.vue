<template>
  <div class="container">
    <section>
      <article>
        <header>
          <h1 class="text--5">{{ title }}</h1>
        </header>

        <Slices :slices="pageContent.body" />
      </article>
    </section>

    <section class="related">
      <article
        v-for="(relatedItem, relatedIndex) in piecesFiltered"
        :key="relatedIndex"
      >
        <n-link :to="{ path: relatedItem.uid }">
          <br /><br /><br /><br />
          <pre>{{ relatedItem.data.title[0].text }}</pre>
          <Pic :image="relatedItem.data.body[0].primary.image" />
        </n-link>
      </article>
    </section>
  </div>
</template>

<script>
import Prismic from 'prismic-javascript'
import Slices from '@/components/templates/slices'
import Pic from '@/components/atoms/pic'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  components: {
    Slices,
    Pic,
  },
  mixins: [routeTransitionFade],
  data() {
    return {
      piecesFiltered: [],
      piecesUnfiltered: [],
      relatedQueriesComplete: 0,
    }
  },
  watch: {
    piecesFiltered(newValue, oldValue) {
      this.$app.$emit('lazy::update')
    },
  },
  asyncData(context) {
    if (context.payload) {
      return generatePageData('pieces_single', context.payload.data)
    } else {
      return initApi().then(api => {
        return api
          .query(
            Prismic.Predicates.at('my.pieces_single.uid', context.params.slug)
          )
          .then(response => {
            return generatePageData('pieces_single', response.results[0])
          })
      })
    }
  },
  mounted() {
    this.$app.$emit('page::mounted')
    this.getRelated()
  },
  methods: {
    getRelated() {
      // for each tag
      this.pageContent.tags.forEach(tag => {
        const id = tag.tag.id

        const results = initApi()
          .then(api => {
            return api.query(
              [
                Prismic.Predicates.at('document.type', 'pieces_single'),
                Prismic.Predicates.at('my.pieces_single.tags.tag', id),
              ],
              { pageSize: 6 }
            )
          })
          .then(response => {
            response.results.forEach(piece => {
              this.piecesUnfiltered.push(piece)
            })

            this.relatedQueriesComplete++
            // sometimes items have multiple tags
            // let's get rid of the duplicates
            if (this.relatedQueriesComplete === this.pageContent.tags.length) {
              this.removeDuplicateFeedItems()
            }
          })
      })
    },
    removeDuplicateFeedItems() {
      const ids = []
      const filteredResults = []

      // hide this one

      this.piecesUnfiltered.forEach(piece => {
        // check this id against registed id's
        const pieceExistsAlready = ids.includes(piece.id)
        const currentPiece = piece.id === this.pageId

        // only save the id/piece if it's not a duplicate
        // and if it isn't this page
        if (!pieceExistsAlready && !currentPiece) {
          ids.push(piece.id)
          filteredResults.push(piece)
        }
      })

      this.piecesFiltered = filteredResults
    },
  },
  head() {
    return this.$setPageMetadata(this.pageContent)
  },
}
</script>

<style lang="scss" scoped>
.related {
  display: flex;
  flex-direction: row;
}
</style>
