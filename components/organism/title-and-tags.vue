<template>
  <div class="info js-animate animate animate--delated">
    <header class="title">
      <h1 class="text--2 text--center">{{ title }}</h1>
    </header>

    <nav class="tags">
      <ul
        ref="tagList"
        class="tags-list text--0 hs"
        :class="{ center: center }"
      >
        <li
          v-for="(tag, tagIndex) in tags"
          :key="`tag-${tagIndex}`"
          ref="tag"
          class="tag"
        >
          <nuxt-link :to="`tags/${tag.tag.slug}`" class="tag-link">
            {{ tag.tag.slug }}
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: [Array, String],
      required: true,
    },
    tags: {
      type: Array,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      tagListWidth: 0,
      tagsWidth: 0,
    }
  },
  computed: {
    center() {
      if (this.tagsWidth > this.tagListWidth) {
        return false
      } else {
        return true
      }
    },
  },
  mounted() {
    this.init()

    window.$app.$on('page::resized', this.init)
    window.$app.$on('lazy::update', this.init)
  },
  beforeDestroy() {
    window.$app.$off('page::resized', this.init)
    window.$app.$off('lazy::update', this.init)
  },
  methods: {
    init() {
      this.measureTags()
      this.styleTags()
    },
    measureTags() {
      // set to padding
      this.tagsWidth = 10

      this.$refs.tag.forEach(tag => {
        this.tagsWidth = this.tagsWidth + tag.clientWidth
      })

      this.tagListWidth = this.$refs.tagList.clientWidth
      // console.clear()
      // console.log(this.tagListWidth, this.tagsWidth)
    },
    styleTags() {
      if (this.tagsWidth > this.tagListWidth) {
        // should be scrollable
        this.$refs.tagList.classList.remove('center')
      } else {
        // center up content
        this.$refs.tagList.classList.add('center')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$gutter: 20px;

.info {
  @include padding(top bottom, 36px, 72px);
  position: relative;
}

.tags {
  margin-top: $gutter * 0.5;
  display: block;
}

.tags-list {
  display: flex;
  align-content: center;
  justify-content: flex-start;
  width: 100vw;

  overflow-x: scroll;
  scroll-snap-type: x proximity;
  padding-bottom: 0.75 * $gutter;
  margin-bottom: -0.25 * $gutter;

  &::before,
  &::after {
    content: '';
    width: 10px;
  }

  &.center {
    justify-content: center;
  }
}

.tag {
  padding: $gutter/2;
  scroll-snap-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tag-link {
  transition: border-color $trans-duration/3 $trans-ease,
    color $trans-duration $trans-ease;
  border: 1px solid rgba(#{var(--color-foreground)}, 0.2);
  border-radius: 100vw;
  font-family: monospace;
  display: inline-flex;
  padding: 1em 1.5em;
  color: rgba(#{var(--color-foreground)}, 0.6);
  text-transform: capitalize;
  line-height: 1;
  outline: none;

  &:before {
    content: '#';
    opacity: 0.5;
  }

  &:focus,
  &:hover {
    border-color: rgba(#{var(--color-foreground)}, 0.8);
    color: rgba(#{var(--color-foreground)}, 1);
  }
}
</style>
