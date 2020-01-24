<!-- pages/index.vue -->

<template>
  <section class="container">
    <header class="">
      <h1>{{ title }}</h1>
    </header>

    <canvas ref="canvas"></canvas>
  </section>
</template>

<script>
import Prismic from 'prismic-javascript'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { LightProbeGenerator } from 'three/examples/jsm/lights/LightProbeGenerator'
import { routeTransitionFade } from '@/mixins/route-transitions'
import { initApi, generatePageData } from '@/prismic-config'

export default {
  mixins: [routeTransitionFade],
  data() {
    return {
      renderer: null,
      lightProbe: null,
      directionalLight: null,
      lightApi: {
        directionalLightIntensity: 0.5,
        envMapIntensity: 12,
      },
      scene: null,
      camera: null,
      controls: null,
      mesh: null,
      raf: null,
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
  beforeDestroy() {
    // kill the animation loop
    cancelAnimationFrame(this.raf)
    // teardown resize event
    window.removeEventListener('resize', this.onWindowResize)
  },
  mounted() {
    this.init()
    this.animate()
    window.addEventListener('resize', this.onWindowResize)
    this.$app.$emit('page::mounted')
  },
  methods: {
    init() {
      this.camera = new THREE.PerspectiveCamera(
        100,
        window.innerWidth / window.innerHeight,
        1,
        1000
      )
      this.camera.position.set(75, 0, 60)

      this.scene = new THREE.Scene()
      /* eslint-disable */
      // this.scene.fog = new THREE.Fog(0x000000, 3);
      /* eslint-enable */

      const texture = new THREE.TextureLoader().load(
        'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3410/_my-face.png'
      )
      const radius = 300
      const widthSegments = 64
      const heightSegments = 64
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
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.outputEncoding = THREE.sRGBEncoding

      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.5
      this.controls.enableZoom = false
      // this.controls.enablePan = false

      this.lightProbe = new THREE.LightProbe()
      this.scene.add(this.lightProbe)
      this.directionalLight = new THREE.DirectionalLight(
        /* eslint-disable */
        0xffffff,
        /* eslint-enable */
        this.lightApi.directionalLightIntensity
      )

      // this.directionalLight.position.set(100, 0, 300)
      // this.scene.add(this.directionalLight)

      // environmental map
      const genCubeUrls = function(prefix, postfix) {
        return [
          prefix + 'px' + postfix,
          prefix + 'nx' + postfix,
          prefix + 'py' + postfix,
          prefix + 'ny' + postfix,
          prefix + 'pz' + postfix,
          prefix + 'nz' + postfix,
        ]
      }
      const urls = genCubeUrls('./images/information/studio/', '.png')

      new THREE.CubeTextureLoader().load(urls, cubeTexture => {
        cubeTexture.encoding = THREE.sRGBEncoding

        this.scene.background = cubeTexture

        this.lightProbe.copy(LightProbeGenerator.fromCubeTexture(cubeTexture))

        const geometry = new THREE.SphereBufferGeometry(45, 64, 64)
        // var geometry = new THREE.TorusKnotBufferGeometry( 4, 1.5, 256, 32, 2, 3 );
        const texture = new THREE.TextureLoader().load(
          'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3410/_my-face.png'
        )

        const material = new THREE.MeshStandardMaterial({
          /* eslint-disable */
          color: 0xFFFFFF,
          // emissive: 0x0000FF,
          /* eslint-enable */
          metalness: 0.1,
          roughness: 0.5,
          envMap: cubeTexture,
          map: texture,
          envMapIntensity: this.lightApi.envMapIntensity,
        })

        // mesh
        this.mesh = new THREE.Mesh(geometry, material)
        this.scene.add(this.mesh)

        this.renderer.render(this.scene, this.camera)
      })
    },
    animate() {
      this.raf = requestAnimationFrame(this.animate)

      this.mesh.rotation.y += 0.005

      // this.controls.update()
      this.renderer.render(this.scene, this.camera)
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
  },
  head() {
    return this.$setPageMetadata(this.pageContent)
  },
}
</script>
