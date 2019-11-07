<template>
  <div
    class="song-list"
    ref='songList'
  >
    <ul>
      <li
        class="song-item"
        v-for="(item,index) in songs"
        :key='item.id'
        @click="playSongs(item,index)"
      >
        <div
          class="rank"
          v-if="isRank"
        >
          <span :class="rankCls(index)">{{ index+1 }}</span>
        </div>
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
  data() {
    return {
      current: null
    }
  },
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    isRank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    describe(item) {
      return `${item.singer}-${item.albumname}`
    },
    playSongs(item, index) {
      this.$emit('getPlaySongs', item, index)
    },
    rankCls(index) {
      if (index === 0) {
        return 'icon icon0'
      } else if (index === 1) {
        return 'icon icon1'
      } else if (index === 2) {
        return 'icon icon2'
      } else {
        return 'text'
      }
    },

  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.song-list {
  position: relative;
  padding: 20px 30px;

  .song-item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;

    .rank {
      width: 25px;
      flex: 0 0 25px;
      margin-right: 30px;
      text-align: center;

      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 100% 100%;

        &.icon0 {
          bg-image('./first');
        }

        &.icon1 {
          bg-image('./second');
        }

        &.icon2 {
          bg-image('./third');
        }
      }

      .text {
        font-size: 18px;
        color: $color-theme;
      }
    }

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
