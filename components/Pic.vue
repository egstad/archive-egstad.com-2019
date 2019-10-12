<template>
  <figure ref="figure" class="pic">
    <img
      v-lazy
      class="image"
      :srcset="[size.sm, size.md, size.lg, size.xl]"
      :alt="alt"
    />

    <figcaption v-if="caption && caption[0].text">
      <prismic-rich-text :field="caption" />
    </figcaption>
  </figure>
</template>

<script>
export default {
  props: {
    image: {
      type: Object,
      required: true,
    },
    caption: {
      type: Array || String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      alt: '',
      aspectRatio: '',
      meta: {},
      size: {},
    }
  },
  created() {
    this.alt = this.image.alt || 'asdf'
    this.meta = {
      width: this.image.dimensions.width,
      height: this.image.dimensions.height,
      aspect: this.image.dimensions.width / this.image.dimensions.height,
    }
    this.size = {
      sm: `${this.image.url}&w=640 640w`,
      md: `${this.image.url}&w=1024 1024w`,
      lg: `${this.image.url}&w=1600 1600w`,
      xl: `${this.image.url}&w=2500 2500w`,
    }
  },
}
</script>

<style lang="scss">
.pic {
}

.image {
  display: block;
  width: 100%;
}
</style>
