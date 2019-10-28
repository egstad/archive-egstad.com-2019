<template>
  <section class="container">
    <ul class="piece-list">
      <li
        v-for="(piece, pieceIndex) in pieces"
        :key="`piece-${pieceIndex}`"
        class="piece-item"
      >
        <article class="piece">
          <div class="piece-link">
            <Slices :slices="piece.data.body" class="piece-assets" />
            <h2>{{ piece.data.title[0].text }}</h2>
          </div>

          <ul class="piece-tag-list">
            <li
              v-for="(tag, tagIndex) in piece.data.tags"
              :key="`tag-${tagIndex}`"
              class="piece-tag-item"
            >
              <nuxt-link :to="`tags/${tag.tag.slug}`" class="piece-tag-link">
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
import Slices from '@/components/templates/slices'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  components: {
    Slices,
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

      // console.log('counter', this.$store.state.pieces.collection)
      // console.log(
      //   'page',
      //   this.$store.state.pieces.pagination.page,
      //   '/',
      //   this.$store.state.pieces.pagination.total_pages
      // )
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
  fetch({ store }) {
    store.dispatch('pieces/fetchPieces')
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

  // wraps figure and title
  &-link {
    display: grid;
    justify-content: center;
    width: 100%;
  }

  // image wrapper
  &-assets {
    // single images
    /deep/.slice--image {
      max-width: 1700px;

      img {
        min-height: 40vw;
        max-height: 80vh;
        width: auto;
        max-width: 100%;
      }
    }

    // gallery
    /deep/.slice--gallery {
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
