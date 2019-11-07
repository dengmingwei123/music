<template>
  <div
    class="recommend"
    ref='recommend'
  >
    <scroll
      :data='discList'
      ref='scroll'
    >
      <!-- 轮播图 -->
      <div
        class="slider-wrapper"
        v-if="slider.length"
      >
        <div class="slider-content">
          <slider :sliderData="slider"></slider>
        </div>
      </div>
      <!-- 歌单推荐列表 -->
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul class="list-box">
          <li
            class="list-item"
            v-for="item in discList"
            :key="item.dissid"
            @click='selectRecommend(item)'
          >
            <img
              v-lazy="item.imgurl"
              width="60"
              height="60"
              class="list-image"
            >
            <div class='list-text'>
              <h2 class='text-title'>{{ item.creator.name }}</h2>
              <p class='text-content'>{{ item.dissname }}</p>
            </div>
          </li>
        </ul>
        <!-- 加载 -->
        <loading v-if="!discList.length"></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from '@/api/recommend'
import { ERR_OK } from '@/api/config'
// 引入轮播图组件
import Slider from '@/base/slider/Slider.vue'
// 引入滚动组件
import Scroll from '@/base/scroll/Scroll.vue'
// 引入加载组件
import Loading from '@/base/loading/Loading.vue'
// 引入mixin方法
import { playListMixin } from '@/common/js/mixin'
// 引入map方法
import { mapMutations } from 'vuex'
export default {
  mixins: [playListMixin],
  data() {
    return {
      slider: [],
      discList: []
    }
  },
  created() {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    handlerPlaylist(playlist) {
      let bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    ...mapMutations({
      setRecommend: 'SET_RECOMMEND'
    }),
    // 选中的推荐列表
    selectRecommend(recommend) {
      this.$router.push({
        path: `/recommend/${recommend.dissid}`
      })
      this.setRecommend(recommend)
    },
    // 获取推荐列表数据
    _getRecommend() {
      getRecommend().then(res => {
        let { code, data: { slider } } = res
        if (code === ERR_OK) {
          this.slider = slider
        }
      })
    },
    _getDiscList() {
      getDiscList().then(res => {
        let { code, data: { list } } = res
        if (code === ERR_OK) {
          this.discList = list
        }
      })
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-list {
    .list-title {
      width: 100%;
      height: 65px;
      line-height: 65px;
      text-align: center;
      color: $color-theme;
      font-size: $font-size-medium;
    }

    .list-box {
      .list-item {
        display: flex;
        padding: 0 20px 20px 20px;

        .list-image {
          padding-right: 20px;
        }

        .list-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: $font-size-medium;

          .text-title {
            margin-bottom: 15px;
          }

          .text-content {
            color: $color-text-d;
          }
        }
      }
    }
  }
}
</style>
