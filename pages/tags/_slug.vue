<template>
  <section class="container spacing-top-7">
    <!-- <header class="spacing-top-7 spacing-bottom-4">
      <h2 class="text--5 text--center">#{{ tagTitle }}</h2>
    </header> -->

    <ul>
      <li>
        <button @click="filter('all')">
          <span>{{ totalResults }}</span>
          <span>All</span>
        </button>
      </li>
      <li>
        <button @click="filter('pieces_single')">
          <span>{{ pageContent.piecesInfo.total }}</span>
          <span>Pieces</span>
        </button>
      </li>
      <li>
        <button @click="filter('projects_single')">
          <span>{{ pageContent.projectsInfo.total }}</span>
          <span>Projects</span>
        </button>
      </li>
    </ul>

    <div class="results">
      <ul ref="list" class="results__list">
        <li
          v-for="(result, index) in taggedResults"
          :key="'result-' + index"
          class="results__list-item"
          :data-type="result.type"
        >
          <nuxt-link :to="'/pieces/' + result.uid" class="results__link">
            <article class="results__item">
              <div class="results__border">
                <template v-if="result.type === 'pieces_single'">
                  <Tile :slices="result.data.body" />
                </template>

                <template v-if="result.type === 'projects_single'">
                  <Pic :image="result.data.thumbnail_url" />
                </template>
              </div>

              <header class="results__header">
                <h3
                  class="text--0 text--truncate text--center text--medium js-animate animate animate--delayed"
                >
                  {{ result.data.title[0].text }}
                </h3>
              </header>
            </article>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import Prismic from 'prismic-javascript'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'
import Tile from '@/components/templates/tile'
import Pic from '@/components/atoms/pic'

export default {
  components: {
    Tile,
    Pic,
  },
  mixins: [routeTransitionFade],
  data() {
    return {
      resultsAreHidden: false,
    }
  },
  computed: {
    taggedResults() {
      // let's merge everything
      return this.pageContent.pieces.concat(this.pageContent.projects)
    },
    totalResults() {
      // let's merge everything
      return this.taggedResults.length
    },
  },
  async asyncData(context) {
    if (context.payload) {
      return generatePageData('tag', context.payload)
    } else {
      const thisSlug = context.route.params.slug
      let thisId = null
      // holds all tag names
      const tags = []
      // holds all tagged pieces
      const pieces = []
      let piecesInfo = {}
      // holds all tagged projects
      const projects = []
      let projectsInfo = {}

      // fetch all tags!
      // we need to get the uid
      await initApi().then(api => {
        return api
          .query(Prismic.Predicates.at('document.type', 'tag'))
          .then(response => {
            for (let i = 0; i < response.results_size; i++) {
              // format data
              const data = {
                id: response.results[i].id,
                name: response.results[i].slugs[0],
              }
              // push to tags
              tags.push(data)
            }
          })
      })

      // find and stash this tags id
      // we'll use this to fetch pieces/projects tagged with such
      await tags.find(el => {
        if (el.name === thisSlug) {
          thisId = el.id
        }
      })

      // fetch pieces!
      await initApi().then(api => {
        return api
          .query(
            [
              Prismic.Predicates.at('document.type', 'pieces_single'),
              Prismic.Predicates.at('my.pieces_single.tags.tag', thisId),
            ],
            { pageSize: 100 }
          )
          .then(response => {
            // save info!
            piecesInfo = {
              total: response.total_results_size,
            }

            response.results.forEach(item => {
              pieces.push(item)
            })
          })
      })

      // fetch projects!
      await initApi().then(api => {
        return api
          .query(
            [
              Prismic.Predicates.at('document.type', 'projects_single'),
              Prismic.Predicates.at('my.projects_single.tags.tag', thisId),
            ],
            { pageSize: 100 }
          )
          .then(response => {
            // save info!
            projectsInfo = {
              total: response.total_results_size,
            }

            response.results.forEach(item => {
              projects.push(item)
            })
          })
      })

      return {
        pageContent: { pieces, piecesInfo, projects, projectsInfo },
      }
    }
  },
  created() {
    this.$app.$store.commit('setTheme', {
      background: '#000000',
      foreground: '#cccccc',
      accent: '#222222',
    })
  },
  mounted() {
    this.$app.$emit('page::mounted')
  },
  methods: {
    filter(query) {
      let filteredElements

      if (query === 'all') {
        filteredElements = document.querySelectorAll(`.results__list-item`)
      } else {
        filteredElements = document.querySelectorAll(
          `.results__list-item[data-type="${query}"]`
        )
      }
      console.log(filteredElements)
    },
  },
  // head() {
  //   return this.$setPageMetadata(this.pageContent)
  // },
}
</script>

<style lang="scss" scoped>
.results {
  // ul, as a grid
  &__list {
    display: grid;
    grid-column-gap: calc(24px + 2vw);
    grid-row-gap: calc(48px + 4vw);
    grid-auto-rows: 1fr;
    padding: calc(24px + 2vw);
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

    @media screen and (min-width: $vp5) {
      grid-template-columns: repeat(6, 1fr);
    }

    // before element is used to ensure that grid items are squares
    &::before {
      content: '';
      width: 0;
      padding-bottom: 100%;
      grid-row: 1 / 1;
      grid-column: 1 / 1;
    }

    // by setting first item to these dimensions, the rest follow suit
    > *:first-child {
      grid-row: 1 / 1;
      grid-column: 1 / 1;
    }
  }

  // ensure all containers fill context
  &__list-item,
  &__item,
  &__wrap,
  &__border,
  &__link {
    width: 100%;
    height: 100%;
    position: relative;
  }

  &__link {
    flex-direction: column;
    display: flex;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    outline: none;

    &:focus {
      .results__border {
        border: 1px solid rgba(#{var(--color-foreground)}, 1);
      }
    }
  }

  &__border {
    transition: border-color $trans-duration/2 $trans-ease;
    border: 1px solid rgba(#{var(--color-foreground)}, 0.2);

    &:hover {
      border: 1px solid rgba(#{var(--color-foreground)}, 1);
    }
  }

  &__header {
    margin-top: 10px;
  }
}

// content to square
/deep/img,
/deep/.vid,
/deep/video,
/deep/.slides img {
  height: 100%;
  width: 100%;
  object-fit: contain;
  object-position: center center;
}
</style>
