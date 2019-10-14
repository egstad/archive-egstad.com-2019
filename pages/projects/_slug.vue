<template>
  <div class="container">
    <h1 class="text--5">{{ title }}</h1>

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
      <figure v-if="slice.slice_type === 'image'">
        <Pic :image="slice.primary.image" />
        <Caption
          v-if="slice.primary.caption.length > 0"
          :caption="slice.primary.caption"
        />
      </figure>

      <!-- VIDEO -->
      <figure v-if="slice.slice_type === 'video'">
        <Vid :video="slice.primary" />
        <Caption
          v-if="slice.primary.caption.length > 0"
          :caption="slice.primary.caption"
        />
      </figure>

      <!-- Gallery -->
      <template v-if="slice.slice_type === 'gallery'">
        <Gallery :collection="slice" />
      </template>
    </div>
  </div>
</template>

<script>
import Prismic from 'prismic-javascript'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'
import Pic from '@/components/atoms/pic'
import Vid from '@/components/atoms/vid'
import Caption from '@/components/atoms/caption'
import Gallery from '@/components/organism/gallery'

export default {
  components: {
    Pic,
    Vid,
    Caption,
    Gallery,
  },
  mixins: [routeTransitionFade],
  asyncData(context) {
    if (context.payload) {
      return generatePageData('projects_single', context.payload.data)
    } else {
      return initApi().then(api => {
        return api
          .query(
            Prismic.Predicates.at('my.projects_single.uid', context.params.slug)
          )
          .then(response => {
            return generatePageData('pieces_single', response.results[0].data)
          })
      })
    }
  },
  mounted() {
    this.$app.$emit('page::mounted')

    console.log(this.pageContent)
  },
  head() {
    return this.$setPageMetadata(this.pageContent)
  },
}
</script>
