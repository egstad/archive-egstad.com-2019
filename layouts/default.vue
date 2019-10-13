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
    $route(to, from) {
      console.log('update')
      this.$app.$emit('route::updated')
    },
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
</style>
