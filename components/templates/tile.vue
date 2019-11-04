<template>
  <section>
    <div
      v-for="(slice, sliceIndex) in slices"
      :key="`slice-${sliceIndex}`"
      :class="`tile tile--${slice.slice_type}`"
    >
      <!-- IMAGE -->
      <figure v-if="slice.slice_type === 'image'">
        <Pic :image="slice.primary.image" class="js-animate animate" />
      </figure>

      <!-- VIDEO -->
      <figure v-if="slice.slice_type === 'video'">
        <Vid :video="slice.primary" class="js-animate animate" />
      </figure>

      <!-- Gallery -->
      <template v-if="slice.slice_type === 'gallery'">
        <Slideshow :slides="slice.items" :options="slideshowOptions" />
      </template>

      <!-- Carousel -->
      <template v-if="slice.slice_type === 'carousel'">
        <Slideshow :slides="slice.items" :options="slideshowOptions" />
      </template>
    </div>
  </section>
</template>

<script>
import Pic from '@/components/atoms/pic'
import Vid from '@/components/atoms/vid'
import Slideshow from '@/components/organism/slideshow'
export default {
  components: {
    Pic,
    Vid,
    Slideshow,
  },
  props: {
    slices: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      slideshowOptions: {
        duration: 3000,
        autoplay: 1,
      },
    }
  },
  mounted() {
    this.$app.$emit('carousel::updateHeight')
  },
}
</script>

<style scoped lang="scss">
section {
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
}

.tile {
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
}
</style>
