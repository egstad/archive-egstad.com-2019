<template>
  <section class="container">
    <h1 class="text--4">{{ title }}</h1>

    <ul>
      <li
        v-for="(piece, pieceIndex) in pieces"
        :key="`piece-${pieceIndex}`"
        class="text--2"
      >
        <nuxt-link :to="piece.uid" append>{{ piece.title }}</nuxt-link>
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
      await generatePageData('pieces', context.payload.data)
    } else {
      const piecesData = []
      await initApi().then(api => {
        return api
          .query(Prismic.Predicates.at('document.type', 'pieces'))
          .then(response => {
            piecesData.push(response.results[0].data)
          })
      })
      await initApi().then(api => {
        return api
          .query(Prismic.Predicates.at('document.type', 'pieces_single'), {
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
            piecesData.push(cleanData)
          })
      })

      return generatePageData('pieces', piecesData)
    }
  },
  mounted() {
    this.$app.$emit('page::mounted')
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
