<template>
  <div class="wrapper" :class="{ 'is-loaded': !isLoading }">
    <Flickity
      ref="gallery"
      :options="galleryOptions"
      class="gallery --bottom"
      @init="onReady"
    >
      <div class="gallery__item js-animate animate">
        <img v-lazy data-src="//placehold.it/400x800" alt="" />
      </div>
      <div class="gallery__item js-animate animate">
        <img
          v-lazy
          data-src="https://images.prismic.io/egstad%2F9f1220ce-c6e4-479d-b0f7-cbcdbc4b962b__ops.jpg?auto=compress,format&w=2500"
          alt=""
        />
      </div>
      <div class="gallery__item js-animate animate">
        <img
          v-lazy
          data-src="https://images.prismic.io/egstad%2F9f1220ce-c6e4-479d-b0f7-cbcdbc4b962b__ops.jpg?auto=compress,format&w=2500"
          alt=""
        />
      </div>
      <div class="gallery__item js-animate animate">
        <img
          v-lazy
          data-src="https://images.prismic.io/egstad%2F9f1220ce-c6e4-479d-b0f7-cbcdbc4b962b__ops.jpg?auto=compress,format&w=2500"
          alt=""
        />
      </div>
      <div class="gallery__item js-animate animate">
        <img
          v-lazy
          data-src="https://images.prismic.io/egstad%2F9f1220ce-c6e4-479d-b0f7-cbcdbc4b962b__ops.jpg?auto=compress,format&w=2500"
          alt=""
        />
      </div>
      <div class="gallery__item js-animate animate">
        <img
          v-lazy
          data-src="https://images.prismic.io/egstad%2F9f1220ce-c6e4-479d-b0f7-cbcdbc4b962b__ops.jpg?auto=compress,format&w=2500"
          alt=""
        />
      </div>
    </Flickity>

    <button @click="previous()">Custom Previous Button</button>
    <button @click="next()">Custom Next Button</button>
  </div>
</template>

<script>
import Flickity from 'vue-flickity'

export default {
  components: {
    Flickity,
  },
  data() {
    return {
      isLoading: true,
      galleryHeight: 300,
      galleryOptions: {
        prevNextButtons: false,
        pageDots: false,

        // options
        wrapAround: true,
        freeScroll: true,
        cellAlign: 'left',
        groupCells: true,
      },
    }
  },
  beforeMount() {
    // when images load, update gallery height
    this.$app.$on('image::loaded', el => {
      if (el.closest('.gallery')) {
        if (this.galleryHeight < el.clientHeight) {
          this.galleryHeight = el.clientHeight
          this.setFlickityHeight()
        }
      }
    })
  },
  mounted() {
    this.$refs.gallery.on('change', index => {})

    this.$app.$on('page::resized', () => {
      this.measureCells()
      this.setFlickityHeight()
    })
  },
  beforeDestroy() {
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
      this.$refs.gallery.$flickity.cells.forEach(item => {
        if (tallest < item.element.clientHeight) {
          tallest = item.element.clientHeight
        }
      })

      this.galleryHeight = tallest
    },
    setFlickityHeight() {
      this.$refs.gallery.$el.style.height = `${this.galleryHeight}px`
      this.$refs.gallery.$flickity.viewport.style.height = `${this.galleryHeight}px`
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

  &.--center {
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
