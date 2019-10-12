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
          <pic
            :image="slice.primary.image"
            :caption="
              slice.primary.caption.length > 0 ? slice.primary.caption : null
            "
          />
        </figure>
      </template>

      <!-- VIDEO -->
      <template v-if="slice.slice_type === 'video'">
        <vid
          :video="slice.primary"
          :caption="
            slice.primary.caption.length > 0 ? slice.primary.caption : null
          "
        />
      </template>

      <!-- Gallery -->
      <template v-if="slice.slice_type === 'gallery'">
        <gallery :collection="slice"></gallery>
      </template>
    </div>
  </article>
</template>

<script>
import Pic from '@/components/Pic'
import Vid from '@/components/Vid'
import Gallery from '@/components/Gallery'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  components: {
    Pic,
    Vid,
    Gallery,
  },
  mixins: [routeTransitionFade],
  asyncData(context) {
    return initApi().then(api => {
      return api.getByUID('page', 'system').then(response => {
        return generatePageData('page', response.data)
      })
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
.slice {
  &__info {
    color: $color-interactive;
    border-top: 1px solid $color-interactive;
    padding-top: 1em;
    margin: 2em 0 6em;
  }
}
</style>
