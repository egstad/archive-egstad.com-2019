<template>
  <div ref="slideshow" class="slideshow">
    <div class="slides">
      <div
        v-for="(item, itemIndex) in slides"
        :key="`item-${itemIndex}`"
        :class="`slide slide__item--${item.media_type} js-animate animate`"
      >
        <!-- IMAGE -->
        <figure v-if="item.media_type === 'image'" style="height: 100%">
          <Pic :image="item.poster" class="js-animate animate" />
        </figure>

        <!-- VIDEO -->
        <figure v-if="item.media_type === 'video'" style="height: 100%">
          <Vid :video="item" class="js-animate animate" />
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
import Pic from '@/components/atoms/pic'
import Vid from '@/components/atoms/vid'
import { Slideshow } from '@/plugins/slideshow'

export default {
  components: {
    Pic,
    Vid,
  },
  props: {
    slides: {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      instance: null,
    }
  },
  mounted() {
    this.instance = new Slideshow(this.$refs.slideshow, this.options)
  },
  beforeDestroy() {
    this.instance.destroy()
  },
}
</script>

<style lang="scss" scoped>
.slideshow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
.slides {
  margin: 0;
  display: flex;
  // align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  outline: none;

  img {
    text-align: center;
    margin: 0;
    max-width: 100%;
    display: block;
  }
}

.slide {
  transition: opacity 0.6s ease-in-out;
  position: absolute;
  // z-index: -1;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  display: block;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  // pointer-events: none;

  &.is-active {
    opacity: 1;
    z-index: 1;
    pointer-events: auto;
  }
}
</style>
