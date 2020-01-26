<!-- pages/index.vue -->

<template>
  <section class="container">
    <Debug />

    <div ref="thing" class="thing">
      <div class="eggball" ref="eggball">
        <canvas ref="canvas"></canvas>
      </div>
    </div>

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

    <Slices :slices="pageContent.body" />
  </section>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
/* eslint-disable */
import Prismic from 'prismic-javascript'
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
  },
  mixins: [routeTransitionFade],
  data() {
    return {
      renderer: null,
      scene: null,
      camera: null,
      controls: null,
      mesh: null,
      raf: null,
      mouse: null,
      target: null,
      windowHalf: null,
      meshMoveInterval: null,
      eggBallCoords: null,
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
    this.$app.$store.commit('setTheme', {
      background: this.pageContent.background,
      foreground: this.pageContent.foreground,
      accent: this.pageContent.accent,
    })
  },
  mounted() {
    this.init()
    this.animate()
    window.addEventListener('resize', this.onWindowResize)
    this.$refs.thing.addEventListener('mouseenter', this.relocateEggball)
    this.$refs.thing.addEventListener('touchstart', this.relocateEggball)
    this.meshMoveInterval = setInterval(this.relocateEggball, 3000)

    this.$app.$emit('page::mounted')
  },
  beforeDestroy() {
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
      this.windowHalf = new THREE.Vector2(
        this.$refs.eggball.clientWidth / 2,
        this.$refs.eggball.clientWidth / 2
      )

      this.scene = new THREE.Scene()

      const texture = new THREE.TextureLoader().load(
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3410/_my-face.png'
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

      const bgColorHex = this.pageContent.background
      const bgColor = bgColorHex.substr(1).toUpperCase()
      // eslint-disable-next-line
      this.scene.fog = new THREE.Fog(`0x${bgColor}`, 420, 550)

      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        canvas: this.$refs.canvas,
        antialias: true,
      })
      this.renderer.setSize(
        this.$refs.eggball.clientWidth,
        this.$refs.eggball.clientWidth
      )

      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.5
      this.controls.enableZoom = false
      // this.controls.minDistance = 200
      // this.controls.maxDistance = 500
      // this.controls.enablePan = false
    },
    animate() {
      this.raf = requestAnimationFrame(this.animate)

      // this.mesh.rotation.y += 0.01
      // this.mesh.rotation.y += 0.01
      // this.target.x = this.mouse.x * 0.005
      // this.target.y = this.mouse.y * 0.002
      // this.camera.rotation.x += 0.05 * (this.target.y - this.camera.rotation.x)
      // this.camera.rotation.y += 0.05 * (this.target.x - this.camera.rotation.y)

      // this.controls.update()
      this.renderer.render(this.scene, this.camera)
    },
    onWindowResize() {
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
          Math.random() * this.$store.state.winWidth -
            this.$refs.thing.clientWidth / 1.5
        ),
        yNew: Math.round(
          Math.random() * this.$store.state.docHeight -
            this.$refs.thing.clientHeight / 1.5
        ),
      }
    },
    setEggballRollVelocity() {
      // x difference
      const xd = this.eggBallCoords.xNew - this.eggBallCoords.x
      // x planes in window
      const xp = this.$store.state.winWidth / 12
      // y difference
      const yd = this.eggBallCoords.yNew - this.eggBallCoords.y
      // y planes in document
      const yp = this.$store.state.docHeight / 12

      // console.log((xd / xp) * 0.4)

      // i fuqd up. somehow these are backwards. but it works. so wutever.
      window.TweenMax.to(this.mesh.rotation, 1.2, {
        ease: window.Power4.easeOut,
        y: (xd / xp) * 0.5,
        x: (yd / yp) * 0.3,
      })
    },
    relocateEggball() {
      clearInterval(this.meshMoveInterval)
      this.updateEggballCoords()
      this.setEggballRollVelocity()

      window.TweenMax.to(this.$refs.thing, 1.2, {
        ease: window.Power4.easeOut,
        x: this.eggBallCoords.xNew,
        y: this.eggBallCoords.yNew,
      })
    },
    onMouseMove(event) {
      this.mouse.x = event.clientX - this.windowHalf.x
      this.mouse.y = event.clientY - this.windowHalf.x

      // this.mesh.rotation.x += 0.01
      // this.mesh.rotation.y += 0.01
      // this.mesh.rotation.x += 0.05 * (this.target.y - this.mesh.rotation.x)
      // this.mesh.rotation.y += 0.05 * (this.target.x - this.mesh.rotation.y)
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
  font-size: 28.3vw;
  white-space: nowrap;
  letter-spacing: -0.08em;
  transform: translateX(-0.1em);
  margin-top: 20vw;
  margin-top: calc(200px + 10vw);
  // padding: 0 calc(#{$grid-gutters} * 0.5 + 4vw);
  font-variation-settings: 'wght' 450 !important;
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

.thing {
  min-width: 150px;
  min-height: 150px;
  max-width: 350px;
  max-height: 350px;
  width: 30vw;
  height: 30vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
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
