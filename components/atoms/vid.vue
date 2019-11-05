<!--
  Vid.vue 
  This component outputs an html video that can: 
  • Loop
  • Autoplay
  • Show/Hide controls
  • Have a poster image
  • Mute
-->
<template>
  <div class="vid">
    <button
      v-if="!isPlaying"
      class="vid__play"
      tabindex="0"
      @click="toggleLoopingPlay"
    >
      Play Video
    </button>
    <video
      ref="video"
      playsinline
      class="vid__video js-lazy"
      :muted="video.is_muted == 'true'"
      :loop="video.will_loop == 'true'"
      :controls="video.has_controls == 'true'"
      :poster="video.poster.url"
      :aria-label="video.alt_text"
      :data-src="video.source.url"
    ></video>
  </div>
</template>

<script>
export default {
  props: {
    video: {
      type: Object,
      required: true,
    },
    caption: {
      type: [Array, String],
      required: false,
      default: null,
    },
  },
  data() {
    return {
      alt: '',
      aspectRatio: '',
      size: {},
      isLoading: true,
      isPlaying: false,
      isMuted: null,
      isAutoplay: null,
      observer: null,
    }
  },
  created() {
    // make this shit readable
    this.isMuted = this.video.is_muted === 'true'
    this.isAutoplay = this.video.is_autoplay === 'true'
  },
  mounted() {
    this.$refs.video.addEventListener('loadedmetadata', this.setDimensions)
    this.$refs.video.addEventListener('canplay', this.videoHandler)
    this.$refs.video.addEventListener('play', this.onPlay)
    this.$refs.video.addEventListener('pause', this.onPause)
    this.$refs.video.addEventListener('ended', this.onEnd)
  },
  beforeDestroy() {
    this.$refs.video.removeEventListener('loadedmetadata', this.setDimensions)
    this.$refs.video.removeEventListener('canplay', this.videoHandler)
    this.$refs.video.removeEventListener('play', this.onPlay)
    this.$refs.video.removeEventListener('pause', this.onPause)
    this.$refs.video.removeEventListener('ended', this.onEnd)
    if (this.observer) {
      this.removeObserver()
    }
  },
  methods: {
    /**
     * Intersection Observer
     */
    addObserver() {
      const options = {
        threshold: 0,
      }
      this.observer = new IntersectionObserver(this.onObserverChange, options)
      this.observer.observe(this.$refs.video)
    },
    removeObserver() {
      this.observer.unobserve(this.$refs.video)
    },
    onObserverChange(videos, observer) {
      videos.forEach(video => {
        const isPlaying =
          // currently playing
          video.target.currentTime > 0 &&
          // and not paused
          !video.target.paused &&
          // and not ended
          !video.target.ended &&
          // has enough data to play
          video.target.readyState > 2

        // pause video when out of view
        if (video.intersectionRatio === 0) {
          // unless the video has audio!
          // keep playing until user says so
          if (this.isMuted) {
            this.pause()
          }
        } else if (
          // user has motion enabled
          !this.$store.state.prefersReducedMotion &&
          // and video isn't playing
          !isPlaying
        ) {
          // play away!
          if (this.isAutoplay) {
            this.play()
          }
        }
      })
    },

    /**
     * Video Utils
     */
    videoHandler() {
      // done loading!
      this.isLoading = false

      if (!this.$store.state.prefersReducedMotion) {
        this.addObserver()
      } else {
        // pause the video
        this.$refs.video.pause()

        // no poster frame?
        if (!this.video.poster.url) {
          // show a few frames in
          // because 1st frame isn't consistent
          this.$refs.video.load()
          this.$refs.video.currentTime = 0.2
        }
      }
    },
    setDimensions() {
      this.size.width = this.$refs.video.videoWidth
      this.size.height = this.$refs.video.videoHeight
      this.size.aspect = (this.size.height / this.size.width).toFixed(2)
    },

    /**
     * Callbacks
     */
    onEnd() {
      this.$refs.video.currentTime = 0
      this.pause()
    },
    onPlay() {
      this.isPlaying = true
    },
    onPause() {
      this.isPlaying = false
    },

    /**
     * Video Helpers
     */
    play() {
      this.isPlaying = true
      this.$refs.video.play()
    },
    pause() {
      this.isPlaying = false
      if (this.$refs.video) {
        this.$refs.video.pause()
      }
    },
    restart() {
      this.$refs.video.currentTime = 0
      this.pause()
    },
    toggleLoopingPlay() {
      // focus on the video
      this.$refs.video.focus({ preventScroll: true })
      // play/pause
      this.isPlaying ? this.pause() : this.play()
    },
  },
}
</script>

<style lang="scss" scoped>
.vid {
  position: relative;

  &__play {
    font-size: 32px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 1;
  }

  &__video {
    display: block;
    width: 100%;
  }
}
</style>
