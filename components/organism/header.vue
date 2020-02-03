<template>
  <header class="site-header">
    <!-- <div class="site-header__toggles"> -->
    <ToggleMenu />
    <!-- <ToggleTags /> -->
    <!-- </div> -->

    <transition name="fade" mode="out-in">
      <h1
        v-if="!$store.state.menuIsOpen"
        :key="label"
        class="label text--truncate text--right"
      >
        {{ label }}
      </h1>
    </transition>

    <nav>
      <ul>
        <li><n-link class="text--3" to="/pieces">Pieces</n-link></li>
        <li><n-link class="text--3" to="/projects">Projects</n-link></li>
        <li>
          <n-link class="text--3" to="/information"
            ><span>Info</span><span class="truncate">rmation</span></n-link
          >
        </li>
        <li><n-link class="text--3" to="/contact">Contact</n-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
import ToggleMenu from '@/components/atoms/toggle-menu'
// import ToggleTags from '@/components/atoms/toggle-tags'
export default {
  components: {
    ToggleMenu,
    // ToggleTags,
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
.text--header {
  @include text-size(21px, 44px);
  letter-spacing: -0.02em;
  text-transform: uppercase;
  line-height: 1;
}

.truncate {
  @media screen and (max-width: $vp-lg) {
    display: none;
  }
}

.site-header {
  padding: 10px $space 14px;
  // @include padding(all, 10px, $space);
  transition: transform $trans-duration $trans-ease,
    background-color $trans-duration $trans-ease,
    box-shadow $trans-duration $trans-ease;
  background-color: rgba(var(--color-background), 0.85);
  backdrop-filter: blur(5px);
  // box-shadow: 0 0.5em 2em 2em rgba(var(--color-background), 1);

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

  @media screen and (min-width: $vp-md) {
    padding: 10px calc(calc(10px + 1vw) * 2) 14px;
  }

  &__toggles {
    display: flex;
    flex-direction: row;
  }
}

nav {
  width: 100%;

  @media screen and (max-width: $vp-md) {
    display: none;
  }

  ul {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  a {
    transition: opacity 0.2s ease-in-out;
    text-transform: uppercase;
    opacity: 0.3;
    line-height: 1;

    &:hover,
    &.nuxt-link-active,
    &.nuxt-link-exact-active {
      opacity: 1;
    }
  }
}

.label {
  @include text-size(44px, 64px);
  letter-spacing: -0.02em;
  text-transform: uppercase;
  line-height: 1;
  margin-top: -0.15em;

  @media screen and (min-width: $vp-md) {
    display: none;
  }
}

.scrolling-down .site-header {
  transform: translate3d(0, -100%, 0);
}
</style>
