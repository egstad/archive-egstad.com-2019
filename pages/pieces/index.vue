<template>
  <section class="container">
    <ul class="piece-list">
      <li
        v-for="(piece, pieceIndex) in pieces"
        :key="`piece-${pieceIndex}`"
        class="piece-item"
      >
        <article class="piece">
          <!-- <nuxt-link :to="piece.uid" append class="piece-link"> -->
          <div class="piece-link">
            <Slices :slices="piece.assets" class="piece-assets" />
            <h2>{{ piece.title[0].text }}</h2>
          </div>
          <!-- </nuxt-link> -->

          <!-- Tags -->
          <ul class="piece-tag-list">
            <li
              v-for="(tag, tagIndex) in piece.tags"
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
  async asyncData(context) {
    /**
     * 1. Fetch all tags
     * 2. Fetch all pieces and projects tagged as 'i'
     */

    // keep track of projects data
    const piecesData = {
      name: 'pieces',
      results: [],
    }

    // keep track of pieces_single's data
    const piecesSinglesData = {
      name: 'pieces_single',
      results: [],
      uids: [],
    }

    // fetch all projects data
    // including uids of ordered projects on within the 'projects' page
    await initApi().then(api => {
      return api
        .query(Prismic.Predicates.at('document.type', 'pieces'))
        .then(response => {
          // grab the uid from prismic
          for (const piecesData of response.results[0].data.pieces) {
            const uid = piecesData.piece.uid
            // add to uids, we'll loop through them soon
            piecesSinglesData.uids.push(uid)
          }

          // capture response
          const projectsResponse = response.results[0].data
          // delete data because we don't need it
          delete projectsResponse.pieces
          // update results
          piecesData.results = projectsResponse
        })
    })

    // Asynchronously fetch all pieces for all tags
    const fetchPiecesFromPrismic = async () => {
      for (let index = 0; index < piecesSinglesData.uids.length; index++) {
        await getAllPiecesData(piecesSinglesData.uids[index])
      }
    }

    // fetch all posts from a specific tag
    const getAllPiecesData = async piecesUID => {
      await initApi().then(api => {
        return api.getByUID('pieces_single', piecesUID).then(response => {
          // lets tidy up this data
          const itemData = {
            title: response.data.title,
            assets: response.data.body,
            tags: response.data.tags,
            uid: response.uid,
          }

          piecesSinglesData.results.push(itemData)
        })
      })
    }

    await fetchPiecesFromPrismic()
    return generatePageData('pieces', [piecesData, piecesSinglesData])
  },
  created() {
    this.$app.$store.commit('setTheme', {
      background: this.pageContent.background,
      foreground: this.pageContent.foreground,
      accent: this.pageContent.accent,
    })
  },
  mounted() {
    this.$app.$emit('page::mounted')
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
