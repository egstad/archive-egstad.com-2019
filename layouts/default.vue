<template>
  <div class="site">
    <Header />
    <Menu />
    <main
      :class="{ 'is-blurred': $store.state.menuIsOpen }"
      class="site-content spacing-top-2"
    >
      <nuxt />
      <SiteFooter />
    </main>
  </div>
</template>

<script>
import Header from '@/components/organism/header'
import Menu from '@/components/organism/menu'
import SiteFooter from '@/components/organism/footer'

export default {
  components: {
    Header,
    Menu,
    SiteFooter,
  },
  data() {
    return {
      siteContent: null,
    }
  },
  watch: {
    // fired when route changes
    $route(to, from) {
      // tell plugins to teardown/restart
      this.$app.$emit('route::updated')
      // tell the store about the new change
      this.$store.commit('updateActivePage', {
        name: to.name,
        path: to.fullPath,
      })
    },
  },
  mounted() {
    this.siteContent = this.$el.querySelectorAll('.site-content')
    // tell the store what page we're on when we mount
    this.$store.commit('updateActivePage', this.$route.name)

    this.$app.$on('site::blurToggle', this.blurHandler)
  },
  methods: {
    blurHandler(val) {
      if (val) {
        window.TweenLite.to(this.siteContent, 0.5, {
          filter: 'blur(50px)',
          opacity: '0.3',
        })
      } else {
        window.TweenLite.to(this.siteContent, 0.3, {
          filter: 'blur(0)',
          opacity: '1',
        })
      }
    },
  },
}
</script>

<style lang="scss">
.site {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  flex-direction: column;
}

.site-content {
  flex: 1;
}

.nuxt-progress {
  transition: background $trans-duration $trans-ease,
    width $trans-duration $trans-ease;
  background: var(--foreground) !important;
  height: 2px;
}
</style>
