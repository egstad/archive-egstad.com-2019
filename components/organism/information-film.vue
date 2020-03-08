<template>
  <div
    class="wrapper"
    ref="wrapper"
    @mousedown="onDocumentMouseDown"
    @mousemove="onDocumentMouseMove"
    @mouseup="onDocumentMouseUp"
  >
    <div class="canvas-wrapper" ref="canvasWrapper">
      <canvas ref="canvas"></canvas>
    </div>
    <div
      class="nav"
      ref="nav"
      @touchstart="onDocumentMouseDown"
      @touchmove="onDocumentMouseMove"
      @touchend="onDocumentMouseUp"
    >
      <div>Drag me!</div>
    </div>
    <button ref="playVideo">Play</button>
    <video :src="video" ref="video" muted playsinline autoplay loop></video>
  </div>
</template>

<script>
import * as THREE from 'three'

// import Draggable from 'gsap/Draggable'
// import Draggable from 'gsap/Draggable'
let Draggable
if (process.client) {
  Draggable = require('gsap/Draggable')
  Draggable = Draggable.Draggable
}

export default {
  props: {
    video: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      renderer: null,
      scene: null,
      camera: null,
      controls: null,
      mesh: null,
      raf: null,
      isUserInteracting: false,
      lon: 0,
      lat: 0,
      phi: 0,
      theta: 0,
      distance: 50,
      onPointerDownPointerX: 0,
      onPointerDownPointerY: 0,
      onPointerDownLon: 0,
      onPointerDownLat: 0,
    }
  },
  mounted() {
    this.init()
    this.animate()
    window.addEventListener('resize', this.onWindowResize, false)

    Draggable.create(this.$refs.nav, {
      type: 'x,y',
      edgeResistance: 0.65,
      bounds: this.$refs.canvasWrapper,
      inertia: true,
    })
  },
  beforeDestroy() {
    // kill the animation loop
    cancelAnimationFrame(this.raf)
    // teardown resize event
    window.removeEventListener('resize', this.onWindowResize)
  },
  methods: {
    init() {
      // setup camera
      this.camera = new THREE.PerspectiveCamera(
        75,
        this.$refs.canvasWrapper.clientWidth /
          this.$refs.canvasWrapper.clientHeight,
        1,
        1100
      )
      this.camera.target = new THREE.Vector3(0, 0, 0)

      this.camera.updateProjectionMatrix()

      // create scene
      this.scene = new THREE.Scene()

      // create environmental sphere
      // we'll map the video to this
      const geometry = new THREE.SphereBufferGeometry(500, 60, 40)
      // invert the geometry on the x-axis so that all of the faces point inward
      geometry.scale(-1, 1, 1)

      // get ze video
      const video = this.$refs.video
      // video.setAttribute('crossorigin', 'anonymous')
      video.crossOrigin = ''
      video.preload = 'auto'
      video.autoload = true
      this.$refs.playVideo.addEventListener('mousedown', () => {
        video.play()
      })

      // convert video to texture
      const texture = new THREE.VideoTexture(video)
      const material = new THREE.MeshBasicMaterial({ map: texture })

      // create mesh
      this.mesh = new THREE.Mesh(geometry, material)

      // add to scene
      this.scene.add(this.mesh)

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.$refs.canvas,
        antialias: true,
      })
      this.renderer.setSize(
        this.$refs.canvasWrapper.clientWidth,
        this.$refs.canvasWrapper.clientHeight
      )
    },
    animate() {
      this.raf = requestAnimationFrame(this.animate)
      this.update()
    },
    update() {
      this.lat = Math.max(-85, Math.min(85, this.lat))
      this.phi = THREE.Math.degToRad(90 - this.lat)
      this.theta = THREE.Math.degToRad(this.lon)

      this.camera.position.x =
        this.distance * Math.sin(this.phi) * Math.cos(this.theta)
      this.camera.position.y = this.distance * Math.cos(this.phi)
      this.camera.position.z =
        this.distance * Math.sin(this.phi) * Math.sin(this.theta)

      this.camera.lookAt(this.camera.target)
      this.camera.aspect =
        this.$refs.canvasWrapper.clientWidth /
        this.$refs.canvasWrapper.clientHeight
      this.camera.updateProjectionMatrix()

      this.renderer.render(this.scene, this.camera)
    },
    onDocumentMouseDown(event) {
      event.preventDefault()

      this.isUserInteracting = true

      if (event.touches) {
        this.onPointerDownPointerX = event.touches[0].clientX
        this.onPointerDownPointerY = event.touches[0].clientY
      } else {
        this.onPointerDownPointerX = event.clientX
        this.onPointerDownPointerY = event.clientY
      }

      this.onPointerDownLon = this.lon
      this.onPointerDownLat = this.lat
    },
    onDocumentMouseMove(event) {
      if (this.isUserInteracting === true) {
        if (event.touches) {
          this.lon =
            (this.onPointerDownPointerX - event.touches[0].clientX) * 0.8 -
            this.onPointerDownLon
          this.lat =
            (event.touches[0].clientY - this.onPointerDownPointerY) * 0.8 -
            this.onPointerDownLat
        } else {
          this.lon =
            (this.onPointerDownPointerX - event.clientX) * 0.5 +
            this.onPointerDownLon
          this.lat =
            (event.clientY - this.onPointerDownPointerY) * 0.5 +
            this.onPointerDownLat
        }
      }
    },
    onDocumentMouseUp() {
      this.isUserInteracting = false
    },
    onWindowResize() {
      this.camera.aspect =
        this.$refs.canvasWrapper.clientWidth /
        this.$refs.canvasWrapper.clientHeight
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(
        this.$refs.canvasWrapper.clientWidth,
        this.$refs.canvasWrapper.clientHeight
      )
    },
  },
  // head() {
  //   return {
  //     script: [{ src: 'gsap/Draggable.min.js' }],
  //   }
  // },
}
</script>

<style lang="scss" scoped>
video {
  display: none;
}

.wrapper {
  position: relative;
}

.canvas-wrapper {
  width: 100%;
  height: 52vh;
}

.nav {
  background: rgba(var(--color-background), 0.7);
  width: 84px;
  height: 84px;
  border-radius: 100%;
  position: absolute;
  top: 1rem;
  left: 1rem;

  > * {
  }
}
</style>
