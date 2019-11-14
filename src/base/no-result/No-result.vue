<template>
  <div class="no-result">
    <div class="no-result-icon">
      <div class='filter'></div>
      <img
        src="./logo.png"
        class='image'
      >
    </div>
    <p class='text'>{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;

  .no-result-icon {
    position: relative;
    width: 70px;
    height: 70px;

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      background-color: $color-background-d;
      width: 100%;
      height: 100%;
    }

    .image {
      width: 100%;
      height: 100%;
    }
  }

  .text {
    margin-top: 30px;
    font-size: $font-size-medium;
    color: $color-text-l;
  }
}
</style>
