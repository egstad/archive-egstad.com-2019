<template>
  <article class="container">
    <Debug />

    <!-- Title -->
    <header class="header grid js-animate animate">
      <h1 class="c12 text--5">Black Optical</h1>
    </header>

    <!-- Two Columns beneath title -->
    <div class="intro grid text--3 js-animate animate">
      <prismic-rich-text
        class="c12 sm-c6 lg-c5 lg-start-c2 space-t1"
        :field="slices[0].items[0].content"
      />

      <prismic-rich-text
        class="c12 sm-c6 lg-c5 space-t1"
        :field="slices[0].items[1].content"
      />
    </div>

    <!-- Image of Laptop -->
    <figure class="grid js-animate animate space-4">
      <Pic :image="slices[1].primary.image" class="c12 js-animate animate" />
    </figure>

    <!-- Process Section -->
    <div class="process grid js-animate animate">
      <div class="sm-cap c12 sm-c6 md-c12 text--4 lg-c3 lg-c0 md-center">
        <prismic-rich-text :field="slices[2].items[0].content" />
      </div>
      <div
        class="sm-cap c12 sm-c6 sm-start-c7 md-c4 md-start-c1 lg-c3 lg-c0 xl-c2 text--2 space-t2"
      >
        <prismic-rich-text :field="slices[2].items[1].content" />
      </div>
      <div
        class="sm-cap c12 sm-c6 sm-start-c7 md-c4 md-start-c5 lg-c3 lg-c0 xl-c2 text--2 space-t1"
      >
        <prismic-rich-text :field="slices[2].items[2].content" />
      </div>
      <div
        class="sm-cap c12 sm-c6 sm-start-c7 md-c4 md-start-c9 lg-c3 lg-c0 xl-c2 text--2 space-t1"
      >
        <prismic-rich-text :field="slices[2].items[3].content" />
      </div>
    </div>

    <!-- Image of Store -->
    <figure class="store js-animate animate space-4">
      <Pic :image="slices[3].primary.image" class="js-animate animate" />
    </figure>

    <!-- Creating a similar space -->
    <div class="space process grid js-animate animate">
      <div class="sm-cap c12 sm-c6 md-c12 text--4 lg-c3 lg-c0 md-center">
        <prismic-rich-text :field="slices[4].items[0].content" />
      </div>
      <div
        class="sm-cap c12 sm-c6 sm-start-c7 md-c4 md-start-c1 lg-c3 lg-c0 xl-c2 text--2 space-t2"
      >
        <prismic-rich-text :field="slices[4].items[1].content" />
      </div>
      <div
        class="sm-cap c12 sm-c6 sm-start-c7 md-c4 md-start-c5 lg-c3 lg-c0 xl-c2 text--2 space-t1"
      >
        <prismic-rich-text :field="slices[4].items[2].content" />
      </div>
      <div
        class="c12 c-align-start md-c4 md-start-c9 lg-c3 lg-c0 xl-c3 xl-start-c10 text--2 space-t2"
      >
        <Pic :image="slices[5].primary.image" class="js-animate animate" />
        <Caption :caption="slices[5].primary.caption" />
      </div>
    </div>

    <!-- Pixel and Macbook -->
    <div class="grid js-animate animate space-4">
      <figure class="c12 lg-c9 js-animate animate c-align-center">
        <Pic :image="slices[7].primary.image" />
      </figure>
      <figure
        class="c8 start-c3 md-c6 md-start-c4 lg-c3 lg-start-c10 c-align-center js-animate animate"
      >
        <Vid :video="slices[6].primary" />
      </figure>
    </div>

    <!-- design -->
    <div class="space process grid js-animate animate">
      <div class="sm-cap c12 sm-c6 md-c12 text--4 lg-c3 lg-c0 md-center">
        <prismic-rich-text :field="slices[8].items[0].content" />
      </div>
      <div
        class="sm-cap c12 sm-c6 sm-start-c7 md-c4 md-start-c1 lg-c3 lg-c0 xl-c2 text--2 space-t2"
      >
        <prismic-rich-text :field="slices[8].items[1].content" />
      </div>
      <div
        class="sm-cap c12 sm-c6 sm-start-c7 md-c4 md-start-c5 lg-c3 lg-c0 xl-c2 text--2 space-t1"
      >
        <prismic-rich-text :field="slices[8].items[2].content" />
      </div>
    </div>

    <!-- Image of Laptop -->
    <figure class="grid js-animate animate space-4">
      <Vid :video="slices[9].primary" class="c12 js-animate animate" />
    </figure>
  </article>
</template>

<style lang="scss" scoped>
.header {
  margin-top: 10vw;

  h1 {
    font-variation-settings: 'wght' 400;
    letter-spacing: -0.06ch;

    @media (min-width: $vp-sm) {
      font-size: 7vw;
      text-align: center;
    }
  }
}

.text--4 {
  @media (min-width: $vp-sm) {
    position: relative;
    top: 1.1ch;
  }
}

// center align at weird size!
.md-center {
  @media (min-width: $vp-md) and (max-width: $vp-lg) {
    text-align: center;
    margin-bottom: $baseline * 2;
  }
}

.intro {
  margin-top: calc(20px + 0.5vw);
}

.space {
  /deep/h2 {
    @media (max-width: $vp-md) {
      max-width: 240px;
    }

    @media (min-width: $vp-lg) {
      padding-right: 2.5vw;
    }

    @media (min-width: $vp-xl) {
      padding-right: 4vw;
    }
  }
}

.process {
  margin-top: calc(20px + 0.5vw);
}
</style>

<script>
/* eslint-disable */
import grid from '@/assets/scss/grid.scss'
import Debug from '@/components/templates/debug'
/* eslint-enable */
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'
import Pic from '@/components/atoms/pic'
import Vid from '@/components/atoms/vid'
import Caption from '@/components/atoms/caption'

export default {
  components: {
    Pic,
    Vid,
    Caption,
    Debug,
  },
  mixins: [routeTransitionFade],
  asyncData(context) {
    if (context.payload) {
      return generatePageData('projects_single', context.payload.data)
    } else {
      return initApi().then(api => {
        return api
          .getByUID('projects_single', 'black-optical')
          .then(response => {
            return generatePageData('projects_single', response.data)
          })
      })
    }
  },
  created() {
    this.$app.$store.commit('setTheme', {
      background: this.pageContent.background,
      foreground: this.pageContent.foreground,
      accent: this.pageContent.accent,
    })
  },
  mounted() {
    this.$app.$emit('page::mounted')
  },
  head() {
    return this.$setPageMetadata(this.pageContent)
  },
}
</script>
