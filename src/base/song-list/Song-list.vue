<template>
  <div class="song-list">
    <ul>
      <li
        class="song-item"
        v-for="item in songs"
        :key='item.id'
      >
        <div class="content">
          <h2 class="title">{{ item.name }}</h2>
          <p class="describe">{{ describe(item) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    describe(item) {
      return `${item.singer}-${item.albumname}`
    }
  },
  watch: {
    songs(newValue) {
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.song-list {
  padding: 20px 30px;

  .song-item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;

    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
    }

    .title {
      no-wrap();
      color: $color-text;
    }

    .describe {
      no-wrap();
      margin-top: 4px;
      color: $color-text-d;
    }
  }
}
</style>
