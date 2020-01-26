<template>
  <div
    ref="wrapper"
    @mousedown="onDocumentMouseDown"
    @mousemove="onDocumentMouseMove"
    @mouseup="onDocumentMouseUp"
  >
    <canvas ref="canvas"></canvas>
    <video :src="video" ref="video" muted playsinline loop></video>
  </div>
</template>

<script>
import * as THREE from 'three'

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
        this.$store.state.winWidth / this.$store.state.winHeight,
        1,
        1100
      )
      this.camera.target = new THREE.Vector3(0, 0, 0)

      // create scene
      this.scene = new THREE.Scene()

      // create environmental sphere
      // we'll map the video to this
      const geometry = new THREE.SphereBufferGeometry(500, 60, 40)
      // invert the geometry on the x-axis so that all of the faces point inward
      geometry.scale(-1, 1, 1)

      // get ze video
      const video = this.$refs.video
      video.setAttribute('crossorigin', 'anonymous')
      video.play()

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
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
    animate() {
      this.raf = requestAnimationFrame(this.animate)
      this.update()
      // this.camera.lookAt(this.camera.target)
      // this.renderer.render(this.scene, this.camera)
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

      this.renderer.render(this.scene, this.camera)
    },
    onDocumentMouseDown(event) {
      event.preventDefault()

      this.isUserInteracting = true

      this.onPointerDownPointerX = event.clientX
      this.onPointerDownPointerY = event.clientY

      this.onPointerDownLon = this.lon
      this.onPointerDownLat = this.lat
    },
    onDocumentMouseMove(event) {
      if (this.isUserInteracting === true) {
        this.lon =
          (this.onPointerDownPointerX - event.clientX) * 0.1 +
          this.onPointerDownLon
        this.lat =
          (event.clientY - this.onPointerDownPointerY) * 0.1 +
          this.onPointerDownLat
      }
    },
    onDocumentMouseUp() {
      this.isUserInteracting = false
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
  },
}
</script>

<style lang="scss" scoped>
video {
  display: none;
}
</style>
