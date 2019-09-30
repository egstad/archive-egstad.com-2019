import Prismic from 'prismic-javascript'
import { prismicConfig, initApi } from './prismic-config'

export default {
  mode: 'universal',
  globalName: 'app',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=2',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      {
        property: 'og:title',
        content: process.env.npm_package_name || '',
        vmid: 'og:title',
      },
      {
        property: 'og:url',
        content: 'https://egstad.com',
        vmid: 'og:url',
      },
      {
        property: 'og:type',
        content: 'website',
        vmid: 'og:type',
      },
      {
        property: 'og:site_name',
        content: process.env.npm_package_name || '',
        vmid: 'og:site_name',
      },
      {
        property: 'og:description',
        content: process.env.npm_package_description || '',
        vmid: 'og:description',
      },
      // {
      //   property: 'og:image:width',
      //   content: '1200',
      //   vmid: 'og:image:width',
      // },
      // {
      //   property: 'og:image:height',
      //   content: '630',
      //   vmid: 'og:image:height',
      // },
      // {
      //   property: 'og:image',
      //   content: ``,
      //   vmid: 'og:image',
      // },
      // {
      //   property: 'twitter:site',
      //   content: '',
      //   vmid: 'twitter:site',
      // },
      // {
      //   property: 'twitter:creator',
      //   content: '',
      //   vmid: 'twitter:creator',
      // },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      {
        rel: 'preconnect',
        href: 'https://code.jquery.com',
      },
      {
        rel: 'preconnect',
        href: 'https://egstad.prismic.io/',
      },
    ],
    /*
     ** JS dude!
     */
    script: [
      {
        innerHTML:
          '{ window.prismic = { endpoint: "' + prismicConfig.baseUrl + '"} }',
      },
      { src: '//static.cdn.prismic.io/prismic.min.js', async: true },
    ],
    __dangerouslyDisableSanitizers: ['script'],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: 'rgb(243, 62, 17)' },

  /*
   ** Global CSS
   */
  css: [
    '@/assets/scss/reset.scss',
    '@/assets/scss/typography.scss',
    '@/assets/scss/spacing.scss',
    '@/assets/scss/animate.scss',
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/prismic/prismic-vue.js',
    '@/plugins/page-metadata.js',
    '@/plugins/device.js',
    {
      src: '@/plugins/scrolls.js',
      ssr: false,
    },
    {
      src: '@/plugins/lazyloader.js',
      ssr: false,
    },
    {
      src: '@/plugins/animate.js',
      ssr: false,
    },
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    '~modules/custom-generate.js',
  ],

  /*
   ** Progressive web app information
   */
  pwa: {
    manifest: {
      name: process.env.npm_package_name,
      lang: 'en',
    },
  },

  /*
   ** Share variables, mixins, functions across all style files (no @import needed)
   */
  styleResources: {
    // your settings here
    scss: ['@/assets/scss/_vars.scss', '@/assets/scss/_mixins.scss'],
  },

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // target the client compiler version to fix the prismic-edit-button
      // remove this if no longer needed as it adds 10k to the dist build
      config.resolve.alias.vue = 'vue/dist/vue.common'

      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.devtool = '#source-map'
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }

      config.node = { fs: 'empty' }
    },

    transpile: ['TweenMax', 'SplitText'],
  },
  generate: {
    async routes() {
      // routes const to store the return array
      const routes = []
      // get prismic api endpoint
      const api = await initApi()
      // object for results
      let results = {}
      // async query to prismic
      const prismicQuery = await api.query(
        Prismic.Predicates.any('document.type', ['homepage', 'pieces_single'])
      )
      // assign the results to our variable object
      results = prismicQuery.results

      // for each object in our result lets create a route
      // not currently using the payload feature because it breaks automatic sitemap generation which requires
      // routes only be string URLs and not objects.
      // https://nuxtjs.org/api/configuration-generate/#speeding-up-dynamic-route-generation-with-code-payload-code-
      results.forEach(item => {
        switch (item.type) {
          case 'homepage':
            routes.push(`/work/${item.uid}`)
            break
          case 'pieces_single':
            routes.push(`/pieces/${item.uid}`)
            break
          default:
            break
        }
      })

      return routes

      // /**
      //  * Fetch content for 'home'
      //  *
      //  * Want to query a different repeatable Custom Type other than home?
      //  * Create the CT in Prismic, populate it with content
      //  * and then change 'home' to 'whatever'
      //  */
      // const homepage = initApi().then(api => {
      //   return api
      //     .query(Prismic.Predicates.at('document.type', 'home'))
      //     .then(response => {
      //       return response.results.map(payload => {
      //         return {
      //           route: '/',
      //           payload,
      //         }
      //       })
      //     })
      // })

      // /**
      //  * Fetch content for 'pieces'
      //  *
      //  * Want to query a different repeatable Custom Type other than pieces?
      //  * Create the CT in Prismic, populate it with content
      //  * and then change 'pieces_single' to 'whatever'
      //  */
      // const pieces = initApi().then(api => {
      //   return api
      //     .query(Prismic.Predicates.at('document.type', 'pieces_single'), {
      //       orderings: '[document.first_publication_date]',
      //     })
      //     .then(response => {
      //       return response.results.map(payload => {
      //         return {
      //           route: `/pieces/${payload.uid}`,
      //           payload,
      //         }
      //       })
      //     })
      // })

      // // We return an array of the results of each promise using the spread operator.
      // // It will be passed to each page as the `payload` property of the `context` object,
      // // which is used to generate the markup of the page.
      // return Promise.all([homepage, pieces]).then(values => {
      //   return [...values[0], ...values[1]]
      // })
    },
  },
}
