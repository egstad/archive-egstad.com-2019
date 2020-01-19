<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  data() {
    return {
      renderer: null,
      scene: null,
      camera: null,
      controls: null,
      mesh: null,
      raf: null,
    }
  },
  mounted() {
    this.init()
    this.animate()
    window.addEventListener('resize', this.onWindowResize)
  },
  beforeDestroy() {
    // kill the animation loop
    cancelAnimationFrame(this.raf)
    // teardown resize event
    window.removeEventListener('resize', this.onWindowResize)
  },
  methods: {
    init() {
      this.camera = new THREE.PerspectiveCamera(
        80,
        window.innerWidth / window.innerHeight,
        1,
        1000
      )
      this.camera.position.z = 400

      this.scene = new THREE.Scene()

      const texture = new THREE.TextureLoader().load(
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3410/_my-face.png'
      )
      const radius = 100
      const widthSegments = 120
      const heightSegments = 80
      const geometry = new THREE.SphereBufferGeometry(
        radius,
        widthSegments,
        heightSegments
      )
      const material = new THREE.MeshBasicMaterial({ map: texture })

      this.mesh = new THREE.Mesh(geometry, material)
      this.scene.add(this.mesh)

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.$refs.canvas,
        antialias: true,
      })
      this.renderer.setSize(window.innerWidth, window.innerHeight)

      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.5
      this.controls.enableZoom = true
      this.controls.minDistance = 200
      this.controls.maxDistance = 500
      // this.controls.enablePan = false
    },
    animate() {
      this.raf = requestAnimationFrame(this.animate)

      this.mesh.rotation.x += 0.01
      this.mesh.rotation.y += 0.02

      // this.controls.update()
      this.renderer.render(this.scene, this.camera)
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
  },
}
</script>
