<template>
  <div class="site">
    <SiteMenu />
    <main class="site-content spacing-top-2">
      <nuxt />
    </main>
    <SiteFooter />
  </div>
</template>

<script>
import SiteMenu from '@/components/organism/header'
import SiteFooter from '@/components/organism/footer'

export default {
  components: {
    SiteMenu,
    SiteFooter,
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
    // tell the store what page we're on when we mount
    this.$store.commit('updateActivePage', this.$route.name)
  },
}
</script>

<style lang="scss">
main {
  padding: 0 20px;
}

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
  background: var(--color-foreground) !important;
  height: 3px;
}
</style>
