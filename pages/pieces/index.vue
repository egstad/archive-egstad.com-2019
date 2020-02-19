<template>
  <section class="container">
    <br /><br /><br /><br /><br />
    <button ref="viewFeed" @click="toggleView('feed')">Feed</button>
    <button ref="viewGrid" @click="toggleView('grid')">Grid</button>

    <Theme
      :colors="{
        background: '#ffffff',
        foreground: '#000000',
        accent: '#0000ff',
      }"
      fade-target="middle"
    />
    <header class="header grid">
      <h2 class="text c12 lg-c6 lg-start-c7">
        These fragments of work provide a glimpse into my process as a designer
        &amp; developer over the last 10 years. Some of these works were the
        final products of months of labor. Others were completed in minutes or
        less.
      </h2>
    </header>

    <nav class="filter"></nav>

    <Theme
      :colors="{
        background: '#000000',
        foreground: '#ffffff',
        accent: '#0000ff',
      }"
      fade-target="top"
    />
    <ul class="piece-list" :class="[isFeedView ? 'as-feed' : 'as-grid']">
      <li
        v-for="(piece, pieceIndex) in pieces"
        :key="`piece-${pieceIndex}`"
        class="piece-item"
        :class="piece.data.body[0].slice_type"
      >
        <article class="piece">
          <div class="piece-info">
            <header class="piece-title">
              <h2 class="text--link">{{ piece.data.title[0].text }}</h2>
            </header>

            <footer class="piece-meta">
              <ul class="piece-tags">
                <li
                  v-for="(tag, tagIndex) in piece.data.tags"
                  :key="`tag-${tagIndex}`"
                  ref="tag"
                  class="tag text--link"
                >
                  <nuxt-link :to="`tags/${tag.tag.slug}`" class="tag-link">
                    {{ tag.tag.slug }}
                  </nuxt-link>
                </li>
              </ul>

              <div class="piece-date text--link">2018</div>
              <div class="piece-cta text--link">See More</div>
            </footer>
          </div>

          <Slices :slices="piece.data.body" class="piece-assets" />
        </article>
      </li>
    </ul>
  </section>
</template>

<script>
import Prismic from 'prismic-javascript'
import Slices from '@/components/templates/slices'
import Theme from '@/components/atoms/theme'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  components: {
    Slices,
    Theme,
    // TitleAndTags,
  },
  mixins: [routeTransitionFade],
  data() {
    return {
      isWaitingOnPrismic: false,
      isFeedView: true,
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
    toggleView(view) {
      switch (view) {
        case 'feed':
          this.isFeedView = true
          break
        case 'grid':
          this.isFeedView = false
          break

        default:
          break
      }
    },
  },
  head() {
    return this.$setPageMetadata(this.pageContent)
  },
}
</script>

<style lang="scss" scoped>
$piece-height: 110vh;
$piece-max-height: 1500px;

.container {
  // padding: 50px;
}

.header {
  padding-top: 30vh;

  .text {
    font-size: 32px;
    line-height: 38px;
    font-variation-settings: 'wght' 500;
  }
}

.filter {
  width: 94vw;
  margin-left: 3vw;
  border-top: 1px solid rgba(var(--color-foreground), 0.8);
  margin-top: 10vw;
  margin-bottom: 10vw;
}

.piece {
  // display: grid;
  // justify-content: center;
  width: 100%;

  // wraps all project content
  &-list {
    display: flex;
    flex-direction: column;
    justify-content: center;

    &.as-feed {
      // title, meta (tags, date, cta)...
      .piece-info {
        border-top: 1px solid rgba(var(--color-foreground), 0.6);
        padding: 15px;
        display: grid;
        grid-template-areas:
          'title'
          'meta';

        @media screen and (min-width: $vp-md) {
          grid-template-columns: repeat(6, 1fr);
          grid-template-areas: 'title title meta meta meta meta';
        }
      }
      .piece-title {
        grid-area: title;
        padding: 0;
        font-family: monospace;
      }
      .piece-meta {
        grid-area: meta;
        padding: 0;
        display: grid;
        grid-template-areas:
          'date'
          'tags'
          'cta';

        @media screen and (min-width: $vp-md) {
          grid-template-columns: repeat(4, 1fr);
          grid-template-areas: 'tags tags date cta';
        }
      }
      .piece-tags {
        grid-area: tags;
        display: flex; /* [1] */
        flex-wrap: nowrap; /* [1] */
        overflow-x: auto; /* [2] */
        -webkit-overflow-scrolling: touch; /* [3] */
        -ms-overflow-style: -ms-autohiding-scrollbar; /* [4] */

        > * {
          margin-right: 1rem;
          display: block;
          background: #ccc;
          border-radius: 100vw;
          width: 100%;
          white-space: nowrap;
          @media screen and (min-width: $vp-md) {
            background: none;
          }
        }

        @media screen and (min-width: $vp-md) {
          display: block;
          columns: 2 auto;
          column-gap: 0;
        }
      }
      .piece-date {
        grid-area: date;
      }
      .piece-cta {
        grid-area: cta;
      }

      // image wrapper
      .piece-assets {
        // display: flex;
        // align-items: center;

        position: relative;
        overflow: hidden;
        // padding: 10%;
        // min-height: 100vw;
        // max-height: 80vh;

        // single images
        /deep/.slice--image,
        /deep/.slice--video {
          display: flex;
          justify-content: center;
          // max-width: 1500px;

          figure {
            display: flex;
            align-items: center;
            padding: $piece-max-height/10 8vw;
            max-height: $piece-max-height;
            height: $piece-height;
            position: relative;
            margin: 0 auto;
          }

          video,
          img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
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

    &.as-grid {
      flex-direction: row;
      flex-wrap: wrap;

      .piece-item {
        flex: 0 0 auto;
        width: 50%;

        @media screen and (min-width: $vp-md) {
          width: 33.333%;
        }
        @media screen and (min-width: $vp-lg) {
          width: 25%;
        }
        @media screen and (min-width: $vp-xl) {
          width: 16.666%;
        }

        &.carousel,
        &.gallery {
          width: 100%;
        }
      }

      // image wrapper
      .piece-assets {
        // single images
        /deep/.slice--image {
          img {
            height: auto;
            width: 100%;
          }
        }

        // gallery
        /deep/.slice--gallery {
          .gallery__item {
            padding: 2.5vw;
          }
        }
      }
    }
  }
}
</style>
