<template>
  <ul :class="`gallery gallery--${alignment}`">
    <li
      v-for="(item, itemIndex) in collection"
      :key="`item-${itemIndex}`"
      :class="`gallery__item gallery__item--${item.media_type}`"
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
    </li>
  </ul>
</template>

<script>
import Pic from '@/components/atoms/pic'
import Vid from '@/components/atoms/vid'
import Caption from '@/components/atoms/caption'

export default {
  components: {
    Pic,
    Vid,
    Caption,
  },
  props: {
    collection: {
      type: Array,
      required: true,
    },
    alignment: {
      type: String,
      required: true,
      default: 'top',
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
