<template>
  <div class="list-view">
    <scroll
      :data="singerList"
      :probeType="probeType"
      ref="scroll"
      :listenScroll="listenScroll"
      :scrollEvents="scrollEvents"
      @getScroll="scroll"
    >
      <!-- 歌手列表 -->
      <ul>
        <li
          class='list-group'
          v-for="(item,index) in singerList"
          :key='index'
          ref='listGroup'
        >
          <h2 class='list-group-title'>{{ item.title }}</h2>
          <ul>
            <li
              class='list-group-item'
              v-for="singer in item.items"
              :key="singer.id"
              @click="selectSinger(singer)"
            >
              <img
                v-lazy="singer.picUrl"
                width="50"
                height="50"
                class="list-group-image"
              >
              <span class='list-group-name'>{{ singer.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <loading v-if="!singerList.length"></loading>
    </scroll>
    <!-- 快速入口 -->
    <div class='shortcut'>
      <ul
        @touchstart="onShortcutTouchStart"
        @touchmove="onShortcutTouchMove"
      >
        <li
          v-for="(item,index) in shortcutList"
          :key="index"
          class="shortcut-item"
          ref="shortcutItem"
          :class="{current:currentIndex===index}"
        >{{ item }}</li>
      </ul>
    </div>
    <!-- 固定标题 -->
    <h2
      class="fixed-title"
      ref="fixedTitle"
      v-if="fixedTitle"
    >{{ fixedTitle }}</h2>
  </div>
</template>

<script>
// 引入滚动组件
import Scroll from '@/base/scroll/Scroll.vue'

// 引入加载组件
import Loading from '@/base/loading/Loading.vue'

// 标题的高度
const TITLE_HEIGHT = 28
export default {
  data() {
    return {
      probeType: 3,
      listenScroll: true,
      scrollEvents: ['scroll'],
      GroupHeight: [],
      scrollY: -1,
      currentIndex: 0,
      touchs: {
        startY: 0,
        moveY: 0
      },
      diff: -1
    }
  },
  props: {
    singerList: {
      type: Array,
      defalut() {
        return []
      }
    }
  },
  computed: {
    // 获取快速入口的列表
    shortcutList() {
      return this.singerList.map(group => {
        return group.title.substr(0, 1)
      })
    },
    // 获取固定标题的文本
    fixedTitle() {
      if (this.scrollY >= 0) {
        return ''
      }
      return this.singerList[this.currentIndex] ? this.singerList[this.currentIndex].title : ''
    }
  },
  mounted() {
  },
  methods: {
    // 选中的歌手数据
    selectSinger(singer) {
      this.$emit('getSelectSinger', singer)
    },
    // 获取分组滚动出去的距离
    _getListGroupHeight() {
      // 获取所有分组
      let listGroup = this.$refs.listGroup
      // 开始总高是0
      let height = 0
      // 第一个是0
      // this.GroupHeight.push(0)
      for (let i = 0; i < listGroup.length; i++) {
        height += listGroup[i].offsetHeight - 1
        this.GroupHeight.push(height)
      }
    },
    // 重新计算容器高度
    refresh() {
      this.$refs.scroll.refresh()
    },
    // 获取实时滚动出去的距离
    scroll(pos) {
      this.scrollY = parseInt(pos.y)
    },
    // 手指触屏开始
    onShortcutTouchStart(e) {
      let index = this.shortcutList.findIndex(v => {
        return v === e.target.innerText
      })
      this.currentIndex = index
      // 保存开始的index
      this.$set(this.touchs, 'startIndex', index)
      // 保存开始的y轴位置
      this.$set(this.touchs, 'startY', e.touches[0].clientY)
      this.scrollToElement(index)
    },
    // 手指滑动之时
    onShortcutTouchMove(e) {
      // 保存移动时候的y轴位置
      this.touchs.moveY = e.touches[0].clientY

      // 获取每个快捷入口的高度
      let shortcutHeight = this.$refs.shortcutItem[0].offsetHeight
      let index = parseInt((this.touchs.moveY - this.touchs.startY) / shortcutHeight)
      index += this.touchs.startIndex
      // 限制最大上滑
      if (this.touchs.moveY <= 268) {
        index = 0
      }
      // 限制最小下滑
      if (this.touchs.moveY >= 676) {
        index = this.$refs.listGroup.length - 1
      }
      this.currentIndex = index
      this.scrollToElement(index)
    },
    // 滚动距离到指定位置
    scrollToElement(index) {
      this.$refs.scroll.scrollToElement(this.$refs.listGroup[index], 0)
    }
  },
  watch: {
    // 监听singerList,党获取到歌手的数据时,获取每组歌手的高度
    singerList(newValue) {
      setTimeout(() => {
        this._getListGroupHeight()
      }, 20)
    },
    // 监听scrollY的变化,当scrollY发生改变,判断快速入口的current显示
    scrollY(newValue) {
      setTimeout(() => {
        let index = this.GroupHeight.findIndex(v => {
          return v >= -newValue
        })
        this.currentIndex = index
        this.diff = newValue
      }, 20)
    },
    // 监听diff
    diff(newValue) {
      setTimeout(() => {
        if (-newValue <= 0) {
          return false
        }
        // 当前索引的分组高度 - 滚动出去的距离 = 下一个标题离现在标题的距离
        let gap = this.GroupHeight[this.currentIndex] - -newValue

        if (gap <= TITLE_HEIGHT) {
          let translateY = TITLE_HEIGHT - gap
          this.$refs.fixedTitle.style.transform = `translate3d(0,${-translateY}px,0)`
        } else {
          if (this.$refs.fixedTitle) {
            this.$refs.fixedTitle.style.transform = 'translate3d(0,0,0)'
          }
        }
      })
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus">
@import '~@/common/stylus/variable.styl';

.list-view {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  // 歌手列表
  .list-group {
    padding-bottom: 20px;

    .list-group-title {
      padding-left: 20px;
      height: 30px;
      font-size: $font-size-small;
      background-color: $color-highlight-background;
      line-height: 30px;
      color: $color-text-l;
      filter: blur(0.1px);
    }

    .list-group-item {
      display: flex;
      align-items: center;
      height: 70px;
      padding: 20px 0 0 30px;
      box-sizing: border-box;

      .list-group-image {
        margin-right: 20px;
        border-radius: 100%;
      }

      .list-group-name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
    }
  }

  // 快捷入口
  .shortcut {
    position: absolute;
    top: 50%;
    right: 0;
    width: 20px;
    z-index: 30;
    transform: translateY(-50%);
    border-radius: 20px;
    padding: 20px 0;
    text-align: center;
    background-color: $color-background-d;
    color: $color-text-l;

    .shortcut-item {
      font-size: $font-size-small;
      padding: 3px;

      &.current {
        color: $color-theme;
      }
    }
  }

  // 固定标题
  .fixed-title {
    position: absolute;
    top: 0;
    height: 30px;
    z-index: 30;
    width: 100%;
    padding-left: 20px;
    line-height: 30px;
    font-size: $font-size-small;
    color: $color-text-l;
    background-color: $color-highlight-background;
    filter: blur(0.2px);
  }
}
</style>
