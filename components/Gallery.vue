<template>
  <ul :class="`gallery gallery--${collection.primary.alignment}`">
    <li
      v-for="(item, itemIndex) in collection.items"
      :key="`item-${itemIndex}`"
      :class="`gallery__item gallery__item--${item.media_type}`"
    >
      <!-- IMAGE -->
      <template v-if="item.media_type === 'image'">
        <pic
          :image="item.poster"
          :caption="item.caption.length > 0 ? item.caption : null"
        />
        <!-- <pic :image="item.poster" :caption="item.caption" /> -->
      </template>

      <!-- VIDEO -->
      <template v-if="item.media_type === 'video'">
        <vid
          :video="item"
          :caption="item.caption.length > 0 ? item.caption : null"
        />
        <!-- <vid :video="item" :caption="item.caption" /> -->
      </template>
    </li>
  </ul>
</template>

<script>
import Pic from '@/components/Pic'
import Vid from '@/components/Vid'

export default {
  components: {
    Pic,
    Vid,
  },
  props: {
    collection: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

  &--bottom {
    align-items: end;
  }

  &--middle {
    align-items: center;
  }

  &--top {
    align-items: start;
  }
}
</style>
