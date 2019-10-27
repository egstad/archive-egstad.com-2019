<template>
  <div>
    <transition name="tag-fade" mode="out-in">
      <button
        v-if="$route.name === 'pieces'"
        key="toggle"
        class="toggle toggle-tags"
        tabindex="0"
      >
        <span class="visually-hidden">Toggle Tags Navigation</span>
        <svg
          class="svg"
          version="1.1"
          viewBox="0 0 22 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            class="fill -nudge"
            d="m10.593 19.333c1.0638 0 1.9259 0.86217 1.9259 1.9259 0 1.0638-0.86217 1.9259-1.9259 1.9259-1.0638 0-1.9259-0.86217-1.9259-1.9259 0-1.0638 0.86217-1.9259 1.9259-1.9259zm-8.6667-19.333c1.0638 0 1.9259 0.86217 1.9259 1.9259 0 1.0638-0.86217 1.9259-1.9259 1.9259-1.0638 0-1.9259-0.86217-1.9259-1.9259 0-1.0638 0.86217-1.9259 1.9259-1.9259zm17.333 0c1.0638 0 1.9259 0.86217 1.9259 1.9259 0 1.0638-0.86217 1.9259-1.9259 1.9259-1.0638 0-1.9259-0.86217-1.9259-1.9259 0-1.0638 0.86217-1.9259 1.9259-1.9259z"
            fill="#fff"
          />
        </svg>
      </button>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.toggle-tags {
  position: relative;
  z-index: -1;
  svg {
    position: relative;
    top: 1px;
  }
}

.tag-fade-enter-active,
.tag-fade-leave-active {
  transition: opacity $trans-duration $trans-ease,
    transform $trans-duration $trans-ease;
}

.tag-fade-enter,
.tag-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
