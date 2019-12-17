<template>
  <header class="site-header">
    <div class="site-header__toggles">
      <ToggleMenu />
      <ToggleTags />
    </div>

    <transition name="fade" mode="out-in">
      <h1
        v-if="!$store.state.menuIsOpen"
        :key="label"
        class="label text--truncate text--right"
      >
        {{ label }}
      </h1>
    </transition>
  </header>
</template>

<script>
import ToggleMenu from '@/components/atoms/toggle-menu'
import ToggleTags from '@/components/atoms/toggle-tags'
export default {
  components: {
    ToggleMenu,
    ToggleTags,
  },
  data() {
    return {
      label: '',
    }
  },
  watch: {
    // update label on route change
    $route(to, from) {
      this.updateLabel(to)
    },
  },
  mounted() {
    this.updateLabel(this.$route)
    this.$app.$on('page::overwriteLabel', this.overwriteLabel)
  },
  beforeDestroy() {
    this.$app.$off('page::updateLabel')
    this.$app.$off('page::overwriteLabel')
  },
  methods: {
    updateLabel(route) {
      let labelText = route.name

      if (route.name === 'index') {
        labelText = 'Egstad'
      } else if (route.name === 'tags-slug') {
        labelText = `#${route.params.slug}`
      } else if (route.name === 'pieces-slug') {
        labelText = 'Pieces'
      } else if (route.name === 'projects-black-optical') {
        labelText = ''
      }

      this.label = labelText
    },
    overwriteLabel(text) {
      this.label = text
    },
  },
}
</script>

<style lang="scss" scoped>
.site-header {
  @include padding(all, 10px, 20px);
  transition: transform $trans-duration $trans-ease;

  // alignment
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  // position
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;
  width: 100%;
  transform: translate3d(0, 0, 0);

  &__toggles {
    display: flex;
    flex-direction: row;
  }
}

.label {
  @include text-size(44px, 64px);
  letter-spacing: -0.02em;
  text-transform: uppercase;
  line-height: 1;
  margin-top: -0.15em;
}

.scrolling-down .site-header {
  transform: translate3d(0, -100%, 0);
}
</style>
