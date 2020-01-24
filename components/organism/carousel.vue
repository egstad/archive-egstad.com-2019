<template>
  <div :class="{ 'is-loaded': !isLoading }" class="wrapper">
    <Flickity
      ref="gallery"
      :options="galleryOptions"
      :class="`gallery --${options.align_y}`"
      @init="onReady"
    >
      <div
        v-for="(item, itemIndex) in slides"
        :key="`item-${itemIndex}`"
        :class="
          `gallery__item gallery__item--${item.media_type} js-animate animate`
        "
      >
        <!-- IMAGE -->
        <figure v-if="item.media_type === 'image'">
          <Pic :image="item.poster" class="js-animate animate" />
          <Caption v-if="item.caption.length > 0" :caption="item.caption" />
        </figure>

        <!-- VIDEO -->
        <figure v-if="item.media_type === 'video'">
          <Vid :video="item" class="js-animate animate" />
          <Caption v-if="item.caption.length > 0" :caption="item.caption" />
        </figure>
      </div>
    </Flickity>

    <button @click="previous()">Custom Previous Button</button>
    <button @click="next()">Custom Next Button</button>
  </div>
</template>

<script>
import Pic from '@/components/atoms/pic'
import Vid from '@/components/atoms/vid'
import Caption from '@/components/atoms/caption'
import Flickity from '~/node_modules/vue-flickity/src/flickity'

export default {
  components: {
    Pic,
    Vid,
    Caption,
    Flickity,
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
      isLoading: true,
      galleryHeight: 300,
      galleryOptions: {
        prevNextButtons: false,
        pageDots: false,
        contain: true,

        // options
        wrapAround: this.options.loop === 'true',
        freeScroll: this.options.snap_scroll === 'true',
        cellAlign: this.options.align_x,
        groupCells: this.options.group_cells === 'true',
        autoPlay: this.options.autoplay_duration,
        fade: this.options.fade === 'true',
      },
    }
  },
  beforeMount() {
    // when images load, update gallery height
    this.$app.$on('image::loaded', el => {
      // does this image exist in this gallery?
      if (el.closest('.gallery')) {
        // if image is taller, update height
        if (this.galleryHeight < el.clientHeight) {
          this.galleryHeight = el.clientHeight
          this.measureCells()
          this.setFlickityHeight()
        }
      }
    })
  },
  mounted() {
    // update cell heights on resize
    this.$app.$on('page::resized', this.resizeFlickity)
    this.$app.$on('carousel::updateHeight', this.resizeFlickity)

    console.log(this.options)
  },
  beforeDestroy() {
    this.$app.$off('carousel::updateHeight')
    this.$app.$off('image::loaded')
    this.$app.$off('page::resized')
  },
  methods: {
    onReady() {
      this.isLoading = 0
    },
    next() {
      this.$refs.gallery.next()
    },
    previous() {
      this.$refs.gallery.previous()
    },
    measureCells() {
      let tallest = 0

      // search for the tallest
      this.$refs.gallery.$flickity.cells.forEach(item => {
        if (tallest < item.element.clientHeight) {
          tallest = item.element.clientHeight
        }
      })

      // update it
      this.galleryHeight = tallest
    },
    setFlickityHeight() {
      this.$refs.gallery.$el.style.height = `${this.galleryHeight}px`
      this.$refs.gallery.$flickity.viewport.style.height = `${this.galleryHeight}px`
    },
    resizeFlickity() {
      // throttle it a bit
      setTimeout(() => {
        this.measureCells()
        this.setFlickityHeight()
      }, 250)
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  opacity: 0;
  transition: opacity $trans-duration $trans-ease;

  &.is-loaded {
    opacity: 1;
  }
}

.gallery {
  display: block;
  width: 100%;

  &.--middle {
    /deep/.flickity-slider {
      display: flex;
      align-items: center;
    }
  }

  &.--bottom {
    /deep/.flickity-slider {
      display: flex;
      align-items: flex-end;
    }
  }

  &__item {
    width: 40%;
    margin: 0 1rem;
  }

  img {
    display: block;
    width: 100%;
    height: auto;
  }
}
</style>
