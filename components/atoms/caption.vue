<template>
  <figcaption>
    <!-- Array (data from prismic) -->
    <template v-if="isPrismic">
      <prismic-rich-text :field="caption" />
    </template>

    <!-- String -->
    <template v-else>
      <p>{{ caption }}</p>
    </template>
  </figcaption>
</template>

<script>
export default {
  props: {
    caption: {
      type: [Array, String],
      required: true,
      default: '',
    },
  },
  computed: {
    isPrismic() {
      const isArray =
        Object.prototype.toString.call(this.caption) === '[object Array]'

      return isArray
    },
  },
}
</script>
