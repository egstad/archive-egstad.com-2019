<template>
  <header class="site-header">
    <!-- <div class="site-header__toggles"> -->
    <ToggleMenu />
    <!-- <ToggleTags /> -->
    <!-- </div> -->

    <h1><n-link class="text--3" to="/" prefetch>Egstad</n-link></h1>

    <nav>
      <ul>
        <li>
          <n-link class="text--3" to="/pieces" prefetch>Pieces</n-link>
        </li>
        <li>
          <n-link class="text--3" to="/projects" prefetch>Projects</n-link>
        </li>
        <li>
          <n-link class="text--3" to="/information" prefetch
            ><span>Info</span><span class="truncate">rmation</span></n-link
          >
        </li>
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

.is-scroll-near-top .site-header,
.is-scroll-top .site-header {
  background: transparent;
  backdrop-filter: blur(0);

  // a {
  //   color: rgba(var(--color-foreground), 1);
  // }
}
.scrolling-down .site-header {
  transform: translate3d(0, -200%, 0);
}

.site-header {
  padding: 0 calc(#{$space}* 2);
  transition: transform $trans-duration $trans-ease,
    background-color $trans-duration $trans-ease;
  // backdrop-filter: blur(10px);
  background-color: rgba(var(--color-background), 1);
  border-bottom: 1px solid rgba(var(--color-foreground), 0.8);

  a {
    color: rgba(var(--color-foreground), 1);
  }

  &:hover {
    background-color: rgba(var(--color-background), 1);
  }

  // alignment
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  // position
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;
  width: 100%;
  transform: translate3d(0, 0, 0);

  a {
    display: block;
    padding: 0.2em 0;
  }

  // @media screen and (min-width: $vp-md) {
  //   padding: 10px calc(calc(10px + 1vw) * 2) 14px;
  // }

  &__toggles {
    display: flex;
    flex-direction: row;
  }
}

h1 {
  grid-column: 1/2;
  text-transform: uppercase;
}

nav {
  grid-column: 2/5;
  @media screen and (max-width: $vp-md) {
    display: none;
  }

  ul {
    display: flex;
    justify-content: space-between;
  }

  a {
    transition: opacity 0.2s ease-in-out;
    text-transform: uppercase;
    opacity: 0.3;
    line-height: 1;
    margin-left: calc(28px + 0.25vw);

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
</style>
