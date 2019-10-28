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
            <Slices :slices="piece.assets" class="piece-assets" />
            <h2>{{ piece.title[0].text }}</h2>
          </div>

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
    <button @click="fetchNextPage()">Load</button>
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
      pagination: {
        page: null,
        results_per_page: 5,
        results_size: null,
        total_pages: null,
        total_results_size: null,
      },
    }

    // fetch all projects data
    // including uids of ordered projects on within the 'projects' page
    // await initApi().then(api => {
    //   return api
    //     .query(Prismic.Predicates.at('document.type', 'pieces'))
    //     .then(response => {
    //       // grab the uid from prismic
    //       for (const piecesData of response.results[0].data.pieces) {
    //         const uid = piecesData.piece.uid
    //         // add to uids, we'll loop through them soon
    //         piecesSinglesData.uids.push(uid)
    //         console.log('all', uid)
    //       }

    //       // capture response
    //       const projectsResponse = response.results[0].data
    //       // delete data because we don't need it
    //       delete projectsResponse.pieces
    //       // update results
    //       piecesData.results = projectsResponse
    //     })
    // })

    // Asynchronously fetch all pieces for all tags
    // const fetchPiecesFromPrismic = async () => {
    //   for (let index = 0; index < piecesSinglesData.uids.length; index++) {
    //     await getAllPiecesData(piecesSinglesData.uids[index])
    //   }
    // }

    // fetch all posts from a specific tag
    // const getAllPiecesData = async piecesUID => {
    //   await initApi().then(api => {
    //     return api.getByUID('pieces_single', piecesUID).then(response => {
    //       // lets tidy up this data
    //       const itemData = {
    //         title: response.data.title,
    //         assets: response.data.body,
    //         tags: response.data.tags,
    //         uid: response.uid,
    //       }

    //       piecesSinglesData.results.push(itemData)
    //     })
    //   })
    // }

    // including uids of ordered projects on within the 'projects' page
    await initApi().then(api => {
      return api
        .query(Prismic.Predicates.at('document.type', 'pieces'))
        .then(response => {
          // capture response
          const projectsResponse = response.results[0].data
          // delete data because we don't need it
          // delete projectsResponse.pieces
          // update results
          piecesData.results = projectsResponse
        })
    })

    const getAllPiecesData = async piecesUID => {
      await initApi().then(api => {
        return api
          .query(Prismic.Predicates.at('document.type', 'pieces_single'), {
            pageSize: piecesSinglesData.pagination.results_per_page,
            orderings: '[document.first_publication_date]',
          })
          .then(response => {
            // save pagination data
            piecesSinglesData.pagination = {
              page: response.page,
              results_per_page: response.results_per_page,
              results_size: response.results_size,
              total_pages: response.total_pages,
              total_results_size: response.total_results_size,
            }

            response.results.map(payload => {
              const itemData = {
                title: payload.data.title,
                assets: payload.data.body,
                tags: payload.data.tags,
                uid: payload.uid,
              }
              piecesSinglesData.results.push(itemData)
            })
          })
      })
    }

    await getAllPiecesData()
    // await fetchPiecesFromPrismic()
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
    this.$app.$on('scroll::nearBottom', this.loadPiecesOnScroll)
    this.$app.$emit('page::mounted')
  },
  methods: {
    loadPiecesOnScroll() {
      if (!this.isWaitingOnPrismic) {
        this.fetchNextPage()
        this.isWaitingOnPrismic = true
      }
    },
    fetchNextPage() {
      if (this.pagination.page < this.pagination.total_pages) {
        initApi().then(api => {
          api
            .query(Prismic.Predicates.at('document.type', 'pieces_single'), {
              pageSize: this.pagination.results_per_page,
              orderings: '[document.first_publication_date]',
              page: this.pagination.page + 1,
            })
            .then(response => {
              // add new pieces to collection
              response.results.map(payload => {
                const itemData = {
                  title: payload.data.title,
                  assets: payload.data.body,
                  tags: payload.data.tags,
                  uid: payload.uid,
                }

                this.pieces.push(itemData)
              })

              // update pagination
              this.pagination = {
                page: response.page,
                results_per_page: response.results_per_page,
                results_size: response.results_size,
                total_pages: response.total_pages,
                total_results_size: response.total_results_size,
              }

              // "all done!"
              setTimeout(() => {
                this.isWaitingOnPrismic = false
              }, 1000)
              // init lazyloading and re-init animations
              this.$app.$emit('lazy::update')
            })
        })
      }

      // // To retrieve the API object, check out the How to Query the API page
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
