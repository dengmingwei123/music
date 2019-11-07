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
        <div class="content">
          <h2 class="title">{{ item.name }}</h2>
          <p class="describe">{{ describe(item) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    }
  },
  methods: {
    describe(item) {
      return `${item.singer}-${item.albumname}`
    },
    playSongs(item, index) {
      this.$emit('getPlaySongs', item, index)
    }
  },
  computed: {
    ...mapGetters(['fullScreen'])
  },
  watch: {
    fullScreen(newVal) {
    }
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
