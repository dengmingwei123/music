<template>
  <div
    class="rank"
    ref='rank'
  >
    <scroll
      :data='topList'
      ref='scroll'
    >
      <ul class="rank-list">
        <li
          class="rank-item"
          v-for="item in topList"
          :key='item.id'
          @click="selectRankList(item)"
        >
          <div class="picBox">
            <img
              :src="item.picUrl"
              class="image"
            >
          </div>
          <ul class="song-list">
            <li
              class='song'
              v-for='(song,index) in item.songList'
              :key="index"
            >
              <span class='rank-num'>{{ index+1 }}</span>
              <span class='rank-text'>{{ topThreeTitle(song) }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
// 引入获取rank数据
import { getRankList } from '@/api/rank'
import { ERR_OK } from '@/api/config'
// 引入滚动组件
import Scroll from '@/base/scroll/Scroll.vue'
// 引入map语法
import { mapMutations } from 'vuex'
// 引入mixin
import { playListMixin } from '@/common/js/mixin'
export default {
  mixins: [playListMixin],
  data() {
    return {
      topList: []
    }
  },
  created() {
    this._getRankList()
  },
  methods: {
    handlerPlaylist(playlist) {
      let bottom = this.playlist.length > 0 ? '60px' : 0
      this.$refs.rank.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    ...mapMutations({
      setRank: 'SET_RANK'
    }),
    // 获取排行列表数据
    async _getRankList() {
      let res = await getRankList()
      let { code, data: { topList } } = res
      if (code === ERR_OK) {
        this.topList = topList
        // console.log(this.topList)
      }
    },
    // 获取前三的名字
    topThreeTitle(item) {
      return `${item.songname}-${item.singername}`
    },
    // 选中的排行列表
    selectRankList(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setRank(item)
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.rank {
  position: fixed;
  top: 88px;
  bottom: 0;
  left: 0;
  right: 0;

  .rank-list {
    padding: 0 20px 20px 20px;

    .rank-item {
      height: 100px;
      padding-top: 20px;
      display: flex;

      .picBox {
        width: 100px;
        height: 100px;

        .image {
          width: 100%;
          height: 100%;
        }
      }

      .song-list {
        flex: 1;
        padding: 0 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: $color-highlight-background;

        .song {
          font-size: 12px;
          line-height: 26px;
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
