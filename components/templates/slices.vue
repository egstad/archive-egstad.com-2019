<template>
  <section>
    <div
      v-for="(slice, sliceIndex) in slices"
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

      <!-- Carousel -->
      <template v-if="slice.slice_type === 'carousel'">
        <Carousel :slides="slice.items" :options="slice.primary" />
      </template>

      <!-- Theme -->
      <template v-if="slice.slice_type === 'themer'">
        <Theme
          :colors="slice.primary"
          :fade-target="slice.primary.fade_target"
        />
      </template>
    </div>
  </section>
</template>

<script>
import Pic from '@/components/atoms/pic'
import Vid from '@/components/atoms/vid'
import Theme from '@/components/atoms/theme'
import Caption from '@/components/atoms/caption'
import Gallery from '@/components/organism/gallery'
import Carousel from '@/components/organism/carousel'
export default {
  components: {
    Pic,
    Vid,
    Theme,
    Caption,
    Gallery,
    Carousel,
  },
  props: {
    slices: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss">
// .slice {
//   padding: 200px;
// }
</style>
