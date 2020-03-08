<template>
  <header class="site-header grid">
    <!-- <div class="site-header__toggles"> -->
    <ToggleMenu />
    <!-- <ToggleTags /> -->
    <!-- </div> -->

    <h1 class="text--header c12 md-c3 md-start-c1 lg-c2 lg-start-c7">
      <n-link to="/" prefetch>Egstad</n-link>
    </h1>

    <nav class="text--header c12 md-c6 md-start-c4 lg-start-c9 lg-c4 grid">
      <ul class="md-c6">
        <li>
          <n-link to="/pieces" prefetch>Pieces</n-link>
        </li>
        <li>
          <n-link to="/projects" prefetch>Projects</n-link>
        </li>
        <li>
          <n-link to="/information" prefetch>Information</n-link>
        </li>
      </ul>
      <ul class="md-c6">
        <li><a href="#">design</a></li>
        <li><a href="#">development</a></li>
        <li><a href="#">direction</a></li>
        <li><a href="#">typography</a></li>
        <li><a href="#">illustration</a></li>
        <li><a href="#">poster</a></li>
        <li><a href="#">magazine</a></li>
        <li><a href="#">book</a></li>
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
  @include text-size(14px, 16px);
  font-family: 'SimplonBPMono-Light';
  text-transform: lowercase;
  line-height: 1;
}

.site-header {
  padding: 0 calc(#{$space}* 2);

  a {
    color: rgba(var(--color-foreground), 1);
    display: block;
    padding: 0.3em 0;
  }

  &__toggles {
    display: flex;
    flex-direction: row;
  }
}

nav {
  padding: 0;

  @media screen and (max-width: $vp-md) {
    display: none;
  }

  a {
    transition: opacity 0.2s ease-in-out;
    opacity: 0.3;

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
