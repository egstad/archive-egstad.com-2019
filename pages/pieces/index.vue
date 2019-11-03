<template>
  <section class="container">
    <ul class="piece-list">
      <li
        v-for="(piece, pieceIndex) in pieces"
        :key="`piece-${pieceIndex}`"
        class="piece-item"
      >
        <article class="piece">
          <Slices :slices="piece.data.body" class="piece-assets" />

          <TitleAndTags
            class="piece-info"
            :title="piece.data.title[0].text"
            :tags="piece.data.tags"
          />
        </article>
      </li>
    </ul>
  </section>
</template>

<script>
import Prismic from 'prismic-javascript'
import Slices from '@/components/templates/slices'
import TitleAndTags from '@/components/organism/title-and-tags'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  components: {
    Slices,
    TitleAndTags,
  },
  mixins: [routeTransitionFade],
  data() {
    return {
      isWaitingOnPrismic: false,
    }
  },
  computed: {
    pieces() {
      this.$app.$emit('lazy::update')
      return this.$store.state.pieces.collection
    },
  },
  async asyncData(context) {
    let prismicResponse = null

    await initApi().then(api => {
      return api
        .query(Prismic.Predicates.at('document.type', 'pieces'))
        .then(response => {
          prismicResponse = response.results[0].data
        })
    })
    return generatePageData('pieces', prismicResponse)
  },
  async fetch({ store }) {
    await store.dispatch('pieces/fetchPieces')
  },
  created() {
    this.$app.$store.commit('setTheme', {
      background: this.pageContent.background,
      foreground: this.pageContent.foreground,
      accent: this.pageContent.accent,
    })
  },
  mounted() {
    this.$app.$on('pieces::loaded', this.updatePrismicThrottle)
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
      this.$store.dispatch('pieces/fetchPieces')
    },
  },
  head() {
    return this.$setPageMetadata(this.pageContent)
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 50px;
}

.piece {
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
    margin: 5vw 0;
    min-height: 50vh;
  }

  // image wrapper
  &-assets {
    // single images
    /deep/.slice--image {
      margin: 0 auto;
      max-width: 1700px;

      img {
        margin: 0 auto;
        min-height: 40vw;
        max-height: 80vh;
        width: auto;
        max-width: 100%;
      }
    }

    // gallery
    /deep/.slice--gallery {
      margin: 0 auto;
      max-width: 2000px;

      .gallery__item {
        padding: 2.5vw;
      }

      img {
        // gallery is two cols, so this actual 100vh
        max-height: 200vh;
        width: auto;
        max-width: 100%;
      }
    }
  }
}
</style>
