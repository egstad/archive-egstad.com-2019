import Prismic from 'prismic-javascript'
import { prismicConfig, initApi } from './prismic-config'

// Used to generate sitemap
// When site generated, all dynamic routes are added here
const siteMapRoutes = [
  {
    url: `/`,
    changefreq: 'monthly',
    priority: 1,
  },
  {
    url: `/pieces`,
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    url: `/projects`,
    changefreq: 'monthly',
    priority: 0.9,
  },
  {
    url: `/information`,
    changefreq: 'monthly',
    priority: 0.9,
  },
  {
    url: `/tags`,
    changefreq: 'monthly',
    priority: 0.8,
  },
]

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
    '@nuxtjs/sitemap',
  ],

  /*
   ** Progressive web app information
   */
  pwa: {
    manifest: {
      name: 'Egstad',
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
      /**
       * Project slugs
       */
      const projectSlugs = await initApi().then(api => {
        return api
          .query(Prismic.Predicates.at('document.type', 'projects_single'), {
            orderings: '[document.first_publication_date]',
            // fetchLinks: ['projects_single.data'],
          })
          .then(response => {
            return response.results.map(payload => {
              // create site map data
              const siteMapData = {
                url: `/projects/${payload.uid}`,
                changefreq: 'monthly',
                priority: 0.7,
              }
              // add to sitemap
              siteMapRoutes.push(siteMapData)

              // generate route & payload!
              return {
                route: `/projects/${payload.uid}`,
                payload,
              }
            })
          })
      })

      /**
       * Pieces slugs
       */
      const piecesSlugs = await initApi().then(api => {
        return api
          .query(Prismic.Predicates.at('document.type', 'pieces_single'), {
            orderings: '[document.first_publication_date]',
            // fetchLinks: ['pieces_single.data'],
          })
          .then(response => {
            return response.results.map(payload => {
              // create site map data
              const siteMapData = {
                url: `/pieces/${payload.uid}`,
                changefreq: 'weekly',
                priority: 0.5,
              }
              // add to sitemap
              siteMapRoutes.push(siteMapData)

              // generate route & payload!
              return {
                route: `/pieces/${payload.uid}`,
                payload,
              }
            })
          })
      })

      /**
       * Page slugs
       */
      const pagesSlugs = await initApi().then(api => {
        return api
          .query([
            Prismic.Predicates.at('document.type', 'page'),
            // blacklist system
            Prismic.Predicates.not('my.page.uid', 'system'),
          ])
          .then(response => {
            return response.results.map(payload => {
              // create site map data
              const siteMapData = {
                url: `${payload.uid}`,
                changefreq: 'monthly',
                priority: 0.7,
              }
              // add to sitemap
              siteMapRoutes.push(siteMapData)

              // generate route & payload!
              return {
                route: `/${payload.uid}`,
                payload,
              }
            })
          })
      })

      /**
       * Tag slugs
       */
      const tagsSlugs = await initApi().then(api => {
        return api
          .query(Prismic.Predicates.at('document.type', 'tag'))
          .then(response => {
            return response.results.map(payload => {
              // create site map data
              const siteMapData = {
                url: `/tags/${payload.data.tag}`,
                changefreq: 'monthly',
                priority: 0.5,
              }
              // add to sitemap
              siteMapRoutes.push(siteMapData)

              // generate route & payload!
              return {
                route: `/tags/${payload.data.tag}`,
                payload,
              }
            })
          })
      })

      // We return an array of the results of each promise using the spread operator.
      // It will be passed to each page as the `payload` property of the `context` object,
      // which is used to generate the markup of the page.
      return Promise.all([
        // homepage,
        // information,
        // projects,
        pagesSlugs,
        projectSlugs,
        piecesSlugs,
        tagsSlugs,
      ]).then(values => {
        return [...values[0], ...values[1], ...values[2], ...values[3]]
      })
    },
  },

  // ───────────────────────────── SITEMAP CONFIG ───────────────────────────── //
  /*
   ** XML sitemap configuration https://www.npmjs.com/package/@nuxtjs/sitemap
   *  Automatically picks up routes from generate unless generate uses payload.
   */
  sitemap: {
    hostname: 'https://egstad.com',
    gzip: true,
    exclude: ['/preview', '/system'],
    defaults: {
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date(),
      lastmodrealtime: true,
    },
    routes: () => {
      return siteMapRoutes
    },
  },
}
