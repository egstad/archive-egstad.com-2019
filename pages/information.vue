<!-- pages/index.vue -->

<template>
  <section class="container">
    <Debug />

    <!-- Three JS Faceball. Aka Eggball -->
    <div ref="eggcarton" class="eggcarton">
      <div class="eggball" ref="eggball">
        <canvas ref="canvas"></canvas>
      </div>
    </div>

    <!-- Logo -->
    <div class="grid">
      <h1 class="logo c12">EGSTAD</h1>

      <p class="para c12">
        I guess this is the part where I tell you about myself. How boring. My
        name is Jordan Egstad - I’m an Associate Design Director &amp; Creative
        Developer living in Portland, Oregon. My role is to connect people and
        ideas. No project is too big or too small — I’ve served plumbers,
        political organizations, restaurants, magazines, musicians, fashion
        designers, fashion retailers, banks, non-profits, tech giants, and
        design companies.
      </p>
    </div>

    <!-- Creating a similar space -->
    <div class="space process grid js-animate animate">
      <div class="sm-cap c12 sm-c6 md-c4 text--2 lg-c4 lg-c0">
        I guess this is the part where I tell you about myself. How boring. My
        name is Jordan Egstad - I’m an Associate Design Director &amp; Creative
        Developer living in Portland, Oregon. My role is to connect people and
        ideas. No project is too big or too small — I’ve served plumbers,
        political organizations, restaurants, magazines, musicians, fashion
        designers, fashion retailers, banks, non-profits, tech giants, and
        design companies.
      </div>
      <div
        class="sm-cap c12 sm-c6 sm-start-c7 md-c4 md-start-c5 lg-c4 lg-c0 text--2 space-t2"
      >
        I guess this is the part where I tell you about myself. How boring. My
        name is Jordan Egstad - I’m an Associate Design Director &amp; Creative
        Developer living in Portland, Oregon. My role is to connect people and
        ideas. No project is too big or too small — I’ve served plumbers,
        political organizations, restaurants, magazines, musicians, fashion
        designers, fashion retailers, banks, non-profits, tech giants, and
        design companies.
      </div>
      <div
        class="sm-cap c12 c-align-start sm-c6 sm-start-c7 md-c4 md-start-c5 lg-c4 lg-c0 text--2 space-t2"
      ></div>
    </div>

    <InformationFilm ref="film" :video="pageContent.video.url" />

    <Slices :slices="pageContent.body" />
  </section>
</template>

<script>
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Prismic from 'prismic-javascript'
import utils from '@/plugins/utils'
import InformationFilm from '@/components/organism/information-film'
/* eslint-disable */
import grid from '@/assets/scss/grid.scss'
import Debug from '@/components/templates/debug'
/* eslint-enable */
import Slices from '@/components/templates/slices'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  components: {
    Slices,
    Debug,
    InformationFilm,
  },
  mixins: [routeTransitionFade],
  data() {
    return {
      // eggball
      renderer: null,
      scene: null,
      camera: null,
      mesh: null,
      raf: null,
      meshMoveInterval: null,
      meshMoveDuration: 1000,
      eggBallCoords: null,
      filmLocation: null,
      themes: [
        {
          foreground: '#FFFFFF', // white
          background: '#FF90BD', // pink
          accent: '#FF0200', // red
        },
        {
          foreground: '#FF1AC2', // magenta
          background: '#FEFE00', // yellow
          accent: '#FF1AC2', // magenta
        },
        {
          foreground: '#1F201E', // charcoal
          background: '#EBE3D8', // gray
          accent: '#0599FF', // blue
        },
        {
          foreground: '#107A49', // forrest
          background: '#E7EBEE', // gray
          accent: '#FFAA00', // yellow
        },
      ],
      themeCurrentIndex: 0,
    }
  },
  asyncData(context) {
    if (context.payload) {
      return generatePageData('information', context.payload.data)
    } else {
      return initApi().then(api => {
        return api
          .query(Prismic.Predicates.at('document.type', 'information'))
          .then(response => {
            return generatePageData('information', response.results[0].data)
          })
      })
    }
  },
  created() {
    this.shuffleThemes()
    this.setRandomTheme()
    // this.$app.$store.commit('setTheme', {
    //   background: this.pageContent.background,
    //   foreground: this.pageContent.foreground,
    //   accent: this.pageContent.accent,
    // })
  },
  mounted() {
    this.init()
    this.animate()
    this.$app.$on('page::resized', this.onWindowResize)
    this.$refs.eggcarton.addEventListener('mouseenter', this.relocateEggball)
    this.$refs.eggcarton.addEventListener('touchstart', this.relocateEggball)
    this.meshMoveInterval = setInterval(
      this.relocateEggball,
      this.meshMoveDuration
    )
    // update location - used to keep ball position above of it
    this.filmLocation = this.$refs.film.$el.getBoundingClientRect().top

    this.$app.$emit('page::mounted')
  },
  beforeDestroy() {
    this.$app.$off('page::resized')
    // kill the animation loop
    cancelAnimationFrame(this.raf)
    // teardown resize event
    window.removeEventListener('resize', this.onWindowResize)
    // window.removeEventListener('mousemove', this.onMouseMove)
    // this.$app.$off('updatePosition')
    clearInterval(this.meshMoveInterval)
  },
  methods: {
    init() {
      // this.$app.$on('updatePosition', this.updateRoll)

      this.camera = new THREE.PerspectiveCamera(
        24,
        this.$refs.eggball.clientWidth / this.$refs.eggball.clientWidth,
        1,
        1000
      )
      this.camera.position.z = 500
      this.mouse = new THREE.Vector2()
      this.target = new THREE.Vector2()

      this.scene = new THREE.Scene()

      const texture = new THREE.TextureLoader().load(
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3410/_me.jpg'
      )
      const radius = 100
      const widthSegments = 64
      const heightSegments = 64
      const geometry = new THREE.SphereBufferGeometry(
        radius,
        widthSegments,
        heightSegments
      )
      const material = new THREE.MeshBasicMaterial({ map: texture })

      this.mesh = new THREE.Mesh(geometry, material)
      this.mesh.rotation.y = 0.35
      this.scene.add(this.mesh)

      const bgColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue('--color-background')
      // F0E6DA
      // eslint-disable-next-line
      this.scene.fog = new THREE.Fog(`rgb(${bgColor})`, 400, 540)

      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        canvas: this.$refs.canvas,
        antialias: true,
      })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(
        this.$refs.eggball.clientWidth,
        this.$refs.eggball.clientWidth
      )

      // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      // this.controls.enableDamping = true
      // this.controls.dampingFactor = 0.5
      // this.controls.enableZoom = false
      // this.controls.minDistance = 200
      // this.controls.maxDistance = 500
      // this.controls.enablePan = false
    },
    animate() {
      this.raf = requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
    },
    onWindowResize() {
      // update location - used to keep ball position above of it
      this.filmLocation = this.$refs.film.$el.getBoundingClientRect().top

      // set camera
      this.camera.aspect =
        this.$refs.eggball.clientWidth / this.$refs.eggball.clientWidth
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(
        this.$refs.eggball.clientWidth,
        this.$refs.eggball.clientWidth
      )
    },
    updateEggballCoords() {
      this.eggBallCoords = {
        // if eggBallCoords don't exist yet, start from zero
        // otherwise, cache the old xNew and yNew before they update
        x: !this.eggBallCoords ? 300 : this.eggBallCoords.xNew,
        y: !this.eggBallCoords ? 300 : this.eggBallCoords.yNew,
        xNew: Math.round(
          utils.getRandomInt(
            0,
            this.$store.state.winWidth - this.$refs.eggcarton.clientWidth
          )
        ),
        yNew: Math.round(
          utils.getRandomInt(
            0,
            this.filmLocation - this.$refs.eggcarton.clientWidth
          )
        ),
      }
    },
    setEggballRollVelocity() {
      // x difference
      const xd = this.eggBallCoords.xNew - this.eggBallCoords.x
      // x planes in window
      const xp = this.$store.state.winWidth / 24
      // y difference
      const yd = this.eggBallCoords.yNew - this.eggBallCoords.y
      // y planes in document
      const yp = this.filmLocation / 24

      // i fuqd up. somehow these are backwards. but it works. so wutever.
      window.TweenMax.to(this.mesh.rotation, 1.2, {
        ease: window.Power4.easeOut,
        y: Math.round((xd / xp) * 0.3),
        x: Math.round((yd / yp) * 0.3),
      })
    },
    relocateEggball() {
      clearInterval(this.meshMoveInterval)
      this.updateEggballCoords()
      this.setEggballRollVelocity()

      window.TweenMax.to(this.$refs.eggcarton, 1.2, {
        ease: window.Power4.easeOut,
        x: this.eggBallCoords.xNew,
        y: this.eggBallCoords.yNew,
      })
    },
    shuffleThemes() {
      const shuffledThemes = utils.shuffle(this.themes)
      this.themes = shuffledThemes
    },
    setRandomTheme() {
      this.$app.$store.commit('setTheme', {
        background: this.themes[this.themeCurrentIndex].background,
        foreground: this.themes[this.themeCurrentIndex].foreground,
        accent: this.themes[this.themeCurrentIndex].accent,
      })

      this.themeCurrentIndex++
    },
  },
  head() {
    return this.$setPageMetadata(this.pageContent)
  },
}
</script>

<style lang="scss" scoped>
// $grid-gutters: calc(20px + 0.5vw);

.logo {
  color: var(--accent);
  font-size: calc(30.4vw - calc(#{$space}));
  white-space: nowrap;
  letter-spacing: -0.08em;
  transform: translateX(-0.1em);
  margin-top: 20vw;
  margin-top: calc(200px + 10vw);
  // padding: 0 calc(#{$grid-gutters} * 0.5 + 4vw);
  font-variation-settings: 'wght' 350 !important;
}

.para {
  font-family: 'TimesNow-SemiLight';
  font-family: 'LLBradford-Light';
  letter-spacing: -0.04em;
  line-height: 1.1;
  font-size: 3.75vw;
  // font-style: italic;
}

.eggball {
  height: 100%;

  canvas {
    width: 100%;
    height: 100%;
  }
}

.eggcarton {
  min-width: 150px;
  min-height: 150px;
  max-width: 350px;
  max-height: 350px;
  width: 30vw;
  height: 30vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  transform: translate3d(40%, 200%, 0);

  &:after {
    content: '';
    display: block;
    min-width: 150px;
    min-height: 150px;
    max-width: 350px;
    max-height: 350px;
    width: 30vw;
    height: 30vw;
    position: absolute;
    top: 0;
    left: 20%;
    background: black;
    border-radius: 100vw;
    transform-origin: center bottom;
    mix-blend-mode: multiply;
    filter: blur(5px);
    transform: matrix(1, -0.2, 0, 0.8, 0, 0);
    z-index: -1;
    opacity: 0.5;
  }
}
</style>
