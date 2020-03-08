<template>
  <div class="debug">
    <div class="debug__nav">
      <div>
        <input id="columns" v-model="gridIsVisible" type="checkbox" />
        <label class="text--1" for="columns">Columns</label>
      </div>
      <div>
        <input id="baseline" v-model="baselineIsVisible" type="checkbox" />
        <label class="text--1" for="baseline">Baseline</label>
      </div>
      <div>
        <div class="viewport text--1">VP:&nbsp;</div>
      </div>
    </div>

    <div v-show="gridIsVisible" class="grid columns">
      <div
        v-for="(col, colIndex) in columnCount"
        :key="colIndex"
        class="c1"
      ></div>
    </div>

    <div v-show="baselineIsVisible" class="grid baseline">
      <div class="baseline"></div>
    </div>
  </div>
</template>

<script>
// import _vars from '@/assets/scss/_vars.scss'
/* eslint-disable */
// import grid from '@/assets/scss/grid.scss'
/* eslint-enable */

export default {
  data() {
    return {
      gridIsVisible: 0,
      baselineIsVisible: 0,
      columnCount: 12,
    }
  },
}
</script>

<style lang="scss" scoped>
$column-color: blue;
$baseline-color: red;

.debug {
  &__nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--foreground);
    z-index: 1000;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    > * {
      padding: 1rem;
      color: var(--background);
    }
  }
}

.grid {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  pointer-events: none;

  .c1 {
    background: $column-color;
    opacity: 0.3;
    height: 100vh;
  }
}

.baseline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 998;
  // background: repeating-linear-gradient(
  //   transparent,
  //   transparent $baseline - 1px,
  //   $baseline-color $baseline
  // );
  background: repeating-linear-gradient(
    $baseline-color,
    $baseline-color 1px,
    transparent 1px,
    transparent $baseline
  );

  @media (min-width: $vp-lg) {
    background: repeating-linear-gradient(
      $baseline-color,
      $baseline-color 1px,
      transparent 1px,
      transparent calc-vw($baseline, $vp-lg)
    );
  }
}

.viewport {
  margin: 0;

  &:after {
    content: 'Default';
    display: inline;

    @media screen and (min-width: $vp-sm) {
      content: 'VP-SM';
    }
    @media screen and (min-width: $vp-md) {
      content: 'VP-MD';
    }
    @media screen and (min-width: $vp-lg) {
      content: 'VP-LG';
    }
    @media screen and (min-width: $vp-xl) {
      content: 'VP-XL';
    }
  }
}
</style>
