<template>
  <section class="container"></section>
</template>

<script>
import Prismic from 'prismic-javascript'
import { initApi } from '@/prismic-config'

export default {
  async asyncData(context) {
    /**
     * Piece slugs
     */
    const piecesSlugs = []
    let piecesPagination = {
      page: 0,
      results_per_page: 20,
    }
    const piecesPaginationInfo = async () => {
      await initApi().then(api => {
        return api
          .query(Prismic.Predicates.at('document.type', 'pieces_single'), {
            page: 1,
            pageSize: piecesPagination.results_per_page,
          })
          .then(response => {
            // update pagination
            piecesPagination.total_pages = response.total_pages
          })
      })
    }
    // Asynchronously fetch all pieces for all tags
    const fetchPiecesFromPrismic = async () => {
      for (let i = 0; i <= piecesPagination.total_pages; i++) {
        await getAllPieces()
      }
    }
    // fetch all posts
    const getAllPieces = async () => {
      await initApi().then(api => {
        return api
          .query(Prismic.Predicates.at('document.type', 'pieces_single'), {
            page: piecesPagination.page + 1,
            pageSize: piecesPagination.results_per_page,
          })
          .then(response => {
            // update pagination
            piecesPagination = {
              page: response.page,
              total_pages: response.total_pages,
            }
            return response.results.map(payload => {
              // generate route & payload!
              piecesSlugs.push({
                route: `/pieces/${payload.uid}`,
                // payload,
              })
            })
          })
      })
    }
    await piecesPaginationInfo()
    await fetchPiecesFromPrismic()

    console.log(piecesSlugs)
  },
  mounted() {
    this.$app.$emit('page::mounted')
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
