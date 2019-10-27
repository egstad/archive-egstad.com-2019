<template>
  <header class="site-header">
    <div class="site-header__toggles">
      <ToggleMenu />
      <ToggleTags />
    </div>

    <transition name="fade" mode="out-in">
      <h1 :key="label" class="label">{{ label }}</h1>
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
      this.setLabel(to)
    },
  },
  mounted() {
    this.setLabel(this.$route)
  },
  beforeDestroy() {
    this.$app.$off('page::setLabel')
  },
  methods: {
    setLabel(route) {
      let labelText = route.name

      if (route.name === 'index') {
        labelText = 'EGSTAD'
      }

      this.label = labelText
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
  z-index: 1;
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
