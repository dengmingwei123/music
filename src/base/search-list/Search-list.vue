<template>
  <div class="history-list">
    <transition-group
      tag='ul'
      name='slide'
    >
      <li
        class='history-item'
        v-for="history in searchs"
        :key="history"
      >
        <p
          class='text'
          @click="selectHistory(history)"
        >{{ history }}</p>
        <div
          class='icon'
          @click='delHistory(history)'
        >
          <i class='icon-delete'></i>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    searchs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    selectHistory(history) {
      this.$emit('selectHistory', history)
    },
    delHistory(history) {
      this.$emit('deleteSearchHistory', history)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.history-list {
  .history-item {
    display: flex;
    height: 35px;
    align-items: center;
    color: $color-text-d;

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.1s;
    }

    &.slide-enter, &.slide-leave-to {
      opacity: 0;
      height: 0;
    }

    .text {
      flex: 1;
      font-size: $font-size-medium-x;
    }

    .icon {
      width: 34px;
      height: 35px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      font-size: $font-size-small;
    }
  }
}
</style>
