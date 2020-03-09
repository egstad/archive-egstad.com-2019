<template>
  <div ref="eggcarton" class="eggcarton">
    <div class="eggball" ref="eggball">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { gsap, Power4 } from 'gsap/all'
import utils from '@/plugins/utils'

export default {
  data() {
    return {
      // eggball
      renderer: null,
      scene: null,
      camera: null,
      mesh: null,
      raf: null,
      meshMoveInterval: null,
      meshMoveDuration: 1700,
      eggBallCoords: null,
      filmLocation: null,
      themeCurrentIndex: 0,
    }
  },
  mounted() {
    this.init()
    this.animate()
    this.$app.$on('page::resized', this.onWindowResize)
    this.$refs.eggcarton.addEventListener('mousedown', this.relocateEggball)
    this.$refs.eggcarton.addEventListener('touchstart', this.relocateEggball)
    this.meshMoveInterval = setInterval(
      this.relocateEggball,
      this.meshMoveDuration
    )
    // update location - used to keep ball position above of it
    // this.filmLocation = document
    //   .querySelector('.fence')
    //   .getBoundingClientRect().top

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
      // this.filmLocation = document
      //   .querySelector('.fence')
      //   .getBoundingClientRect().top

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
            this.$store.state.docHeight * 0.5 -
              this.$refs.eggcarton.clientHeight
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
      const yp = this.$store.state.docHeight / 24

      // i fuqd up. somehow these are backwards. but it works. so wutever.
      gsap.to(this.mesh.rotation, 1.5, {
        ease: Power4.easeOut,
        y: Math.round((xd / xp) * 0.2),
        x: Math.round((yd / yp) * 0.6),
      })
    },
    relocateEggball() {
      clearInterval(this.meshMoveInterval)
      this.updateEggballCoords()
      this.setEggballRollVelocity()

      gsap.to(this.$refs.eggcarton, 1.5, {
        ease: Power4.easeOut,
        x: this.eggBallCoords.xNew,
        y: this.eggBallCoords.yNew,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
$width: 22vw;
$max-width: 600px;

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
  max-width: $max-width;
  max-height: $max-width;
  width: $width;
  height: $width;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  transform: translate3d(40%, -200%, 0);

  &:after {
    content: '';
    display: block;
    min-width: 150px;
    min-height: 150px;
    max-width: $max-width;
    max-height: $max-width;
    width: $width;
    height: $width;
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
