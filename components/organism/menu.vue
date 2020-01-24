<template>
  <nav
    :class="{ 'is-active': $store.state.menuIsOpen }"
    class="js-menu menu cover"
    tabindex="-1"
  >
    <ul
      class="menu__list js-menu-list"
      role="dialog"
      aria-modal="true"
      aria-hidden="true"
      @click="closeOnClick($event)"
      @keydown="keyboardNavigation($event)"
    >
      <li class="menu__item">
        <n-link
          class="menu__link tab-focus"
          tabindex="0"
          to="/"
          @click.native="checkActive($event)"
          ><span class="tab-focus__content" tabindex="-1">Egstad</span></n-link
        >
      </li>
      <li class="menu__item">
        <n-link
          class="menu__link tab-focus"
          tabindex="0"
          to="/pieces"
          @click.native="checkActive($event)"
          ><span class="tab-focus__content" tabindex="-1">Pieces</span></n-link
        >
      </li>
      <li class="menu__item">
        <n-link
          class="menu__link tab-focus"
          tabindex="0"
          to="/projects"
          @click.native="checkActive($event)"
          ><span class="tab-focus__content" tabindex="-1"
            >Projects</span
          ></n-link
        >
      </li>
      <li class="menu__item">
        <n-link
          class="menu__link tab-focus"
          tabindex="0"
          to="/information"
          @click.native="checkActive($event)"
          ><span class="tab-focus__content" tabindex="-1">Info</span></n-link
        >
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      element: null,
      focusableEls: null,
      focusableFirst: null,
      focusableLast: null,
      focusedElBeforeOpen: null,
      menuStaggerInstance: null,
    }
  },
  watch: {
    // close after changing route
    $route(from, to) {
      this.close()
    },
  },
  mounted() {
    this.focusableEls = document.querySelectorAll('.toggle-menu, .menu__link')
    this.focusableFirst = this.focusableEls[0]
    this.focusableLast = this.focusableEls[this.focusableEls.length - 1]
    this.focusedElBeforeOpen = document.activeElement

    // Use this to close the menu from anywhere
    // @click="$root.$emit('menu::open', $event)"
    this.$app.$on('menu::open', e => {
      this.focusedElBeforeOpen = e.target
      this.open()
    })

    // Use this to close the menu from anywhere
    // @click="$root.$emit('menu::close', $event)"
    this.$app.$on('menu::close', e => {
      this.close()
    })

    this.$app.$on('menu::toggle', e => {
      this.focusedElBeforeOpen = e.target
      this.toggle()
    })

    this.bind()
  },
  methods: {
    keyboardNavigation(e) {
      // keyboard controls
      const isTabPressed = e.key === 'Tab' || e.keyCode === 9
      const isEscPressed = e.key === 'Escape' || e.keyCode === 27

      if (!this.$store.state.menuIsOpen) {
        return
      }
      // // close on escape
      if (isEscPressed) {
        this.close()
      }

      // only pay attention to tab
      if (isTabPressed) {
        // focus next or last
        if (e.shiftKey) {
          // shift and tab goes back
          if (document.activeElement === this.focusableFirst) {
            this.focusableLast.focus()
            e.preventDefault()
          }
        } else if (!e.shiftKey) {
          // tab alone moves forward
          if (document.activeElement === this.focusableLast) {
            this.focusableFirst.focus()
            e.preventDefault()
          }
        }
      }
    },

    checkActive(e) {
      const clickedLink = e.target
      const linkIsActive = clickedLink.classList.contains(
        'nuxt-link-exact-active'
      )

      if (linkIsActive) {
        this.close()
      }
    },

    closeOnClick(e) {
      if (e.target === this.$el) {
        this.close()
      }
    },

    bind() {
      // set visibility after closed
      this.$el.addEventListener('transitionend', this.hideAfterTransition)

      // close menu on scroll
      window.addEventListener('scroll', this.close)
    },

    hideAfterTransition() {
      if (!this.$store.state.menuIsOpen) {
        this.$el.style.visibility = 'hidden'
      }
    },

    open() {
      // open thang
      this.$store.commit('menuToggle', true)
      this.$el.style.visibility = 'visible'
      this.showLinks()

      // set focus
      this.$el.setAttribute('aria-hidden', 'false')
      this.focusableFirst.focus()
    },

    close() {
      if (this.$store.state.menuIsOpen) {
        this.$store.commit('menuToggle', false)
        // this.hideLinks()
      }

      // reset focus
      this.$el.setAttribute('aria-hidden', 'true')
      window.focus()
      document.activeElement.blur()
    },

    toggle() {
      this.$store.state.menuIsOpen ? this.close() : this.open()
    },

    showLinks() {
      window.TweenMax.set('.menu__item', {
        opacity: 0,
        y: 50,
      })
      window.TweenMax.staggerTo('.menu__item', 1, {
        opacity: 1,
        stagger: 0.1,
        y: 0,
        ease: window.Power2.easeOut,
      })
    },
    hideLinks() {
      window.TweenMax.staggerTo('.menu__item', 1, {
        opacity: 0,
        ease: window.Power2.easeOut,
      })
    },
  },
}
</script>

<style scoped lang="scss">
.menu {
  @include padding(all, 15px, 30px);
  @include text-uppercase();
  transition: opacity $trans-duration $trans-ease;
  background: transparent;

  // position
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media screen and (min-width: $vp-lg) {
    // center up links
    align-items: center;
  }

  // if scrollable
  // -webkit-overflow-scrolling: touch;
  // overflow-y: auto;
  // overflow-x: hidden;

  // visibility
  opacity: 0;
  pointer-events: none;
  // visibility: hidden;

  &.is-active {
    opacity: 1;
    pointer-events: all;
  }
}

.menu__list {
  @media screen and (min-width: $vp-lg) {
    // padding: 0 10vw;
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    .menu__link {
      padding: 0.8vw 2.5vw;
    }
  }

  &:hover {
    // fade all links
    .menu__link .tab-focus__content {
      opacity: 0.3;
    }

    // show hover
    .menu__link:hover .tab-focus__content {
      opacity: 1;
    }
  }
}

.menu__link {
  @include text-size(44px, 84px);
  letter-spacing: -0.025em;
  line-height: 1.2;
  text-decoration: none;

  // fade all links
  .tab-focus__content {
    opacity: 0.3;
  }

  &.nuxt-link-exact-active {
    // show active
    .tab-focus__content {
      opacity: 1;
    }
  }

  &:focus > .tab-focus__content {
    opacity: 1;
    box-shadow: 0 0 20px 7px var(--foreground);
    border-radius: 100vw;
    padding: 0 2vw;
  }
}
</style>
