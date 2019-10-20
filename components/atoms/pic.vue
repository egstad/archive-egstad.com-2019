<template>
  <img
    v-lazy
    class="image"
    :srcset="[size.sm, size.md, size.lg, size.xl]"
    :alt="alt"
  />
</template>

<script>
export default {
  props: {
    image: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      alt: '',
      aspectRatio: '',
      meta: {},
      size: {},
      transformedUrl: null,
    }
  },
  created() {
    // set alt tag
    this.alt = this.image.alt || ''

    // remove imgix format tag because webp sucks ass
    this.transformedUrl = this.image.url.replace(
      '?auto=compress,format',
      '?auto=compress'
    )

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
