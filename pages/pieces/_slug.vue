<template>
  <article class="container">
    <header>
      <h1 class="text--5">{{ title }}</h1>
    </header>

    <div
      v-for="(slice, sliceIndex) in pageContent.body"
      :key="`slice-${sliceIndex}`"
      :class="`slice slice--${slice.slice_type}`"
    >
      <!-- TEXT -->
      <template v-if="slice.slice_type === 'text'">
        <prismic-rich-text :field="slice.items[0].content" />
      </template>

      <!-- IMAGE -->
      <template v-if="slice.slice_type === 'image'">
        <figure v-if="slice.primary.image.url">
          <pic :image="slice.primary.image" />
        </figure>
      </template>

      <!-- VIDEO -->
      <template v-if="slice.slice_type === 'video'">
        <vid :video="slice.primary"></vid>
      </template>
    </div>
  </article>
</template>

<script>
import Prismic from 'prismic-javascript'
import Pic from '@/components/Pic'
import Vid from '@/components/Vid'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  components: {
    Pic,
    Vid,
  },
  mixins: [routeTransitionFade],
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
            return generatePageData('pieces_single', response.results[0].data)
          })
      })
    }
  },
  mounted() {
    this.$app.$emit('page::mounted')

    // console.log(this.pageContent)
  },
  head() {
    return this.$setPageMetadata(this.pieces)
  },
}
</script>
