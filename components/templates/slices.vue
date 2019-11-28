<template>
  <div>
    <div
      v-for="(slice, sliceIndex) in slices"
      :key="`slice-${sliceIndex}`"
      :class="`slice slice--${slice.slice_type}`"
    >
      <!-- TEXT -->
      <template v-if="slice.slice_type === 'text'">
        <template v-for="(text, textIndex) in slice.items">
          <prismic-rich-text :key="'text' + textIndex" :field="text.content" />
        </template>
      </template>

      <!-- IMAGE -->
      <figure v-if="slice.slice_type === 'image'">
        <Pic :image="slice.primary.image" class="js-animate animate" />
        <Caption
          v-if="slice.primary.caption.length > 0"
          :caption="slice.primary.caption"
        />
      </figure>

      <!-- VIDEO -->
      <figure v-if="slice.slice_type === 'video'">
        <Vid :video="slice.primary" class="js-animate animate" />
        <Caption
          v-if="slice.primary.caption.length > 0"
          :caption="slice.primary.caption"
        />
      </figure>

      <!-- Gallery -->
      <template v-if="slice.slice_type === 'gallery'">
        <Gallery
          :collection="slice.items"
          :alignment="slice.primary.alignment"
        />
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
  </div>
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
