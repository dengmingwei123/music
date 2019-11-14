<template>
  <transition name='list-fade'>
    <div
      class='play-list'
      @click='hidePlayList'
      v-show='showFlag'
    >
      <div
        class="list-wrapper"
        @click.stop
      >
        <!-- 列表标题 -->
        <div class="list-header">
          <h1 class='title'>
            <div class='icon'>
              <i
                class='play-state'
                :class='iconMode'
                @click='changeMode'
              ></i>
            </div>
            <div class='text'>{{ playTitle }}</div>
            <div
              class="icon"
              @click='delAllSong'
            >
              <i class='trash icon-clear'></i>
            </div>
          </h1>
        </div>

        <!-- 歌曲列表 -->
        <scroll
          class='list-content'
          ref='listContent'
          :data="sequenceList"
        >
          <transition-group
            name='list'
            tag='ul'
            class='list-box'
          >
            <li
              class='list-item'
              ref='listItem'
              v-for="(item,index) in sequenceList"
              :key='item.id'
            >
              <div class="icon">
                <i
                  class='current'
                  :class='currentPlaySong(item)'
                ></i>
              </div>
              <div
                class='text'
                @click='selectItem(item,index)'
              >{{ item.name }}</div>
              <div
                class="icon"
                @click='collectList(item)'
              >
                <i
                  :class='myLoveSongIcon(item)'
                  class='current'
                ></i>
              </div>
              <div
                class='icon'
                @click='deleteOneSong(item)'
              >
                <i class='icon-delete'></i>
              </div>
            </li>
          </transition-group>
        </scroll>

        <!-- 添加按钮 -->
        <div
          class="list-operate"
          @click='openAddSong'
        >
          <div class="add">
            <div class="icon">
              <div class="icon-add"></div>
            </div>
            <p class='text'>添加歌曲到列表</p>
          </div>
        </div>

        <!-- 关闭列表 -->
        <div
          class="list-close"
          @click="hidePlayList"
        >
          <span class='text'>关闭</span>
        </div>
      </div>
      <add-song ref='addSong'></add-song>
    </div>
  </transition>
</template>

<script>
import { playMode } from '@/common/js/config'
// 引入滚动组件
import Scroll from '@/base/scroll/Scroll'
// 引入播放器mixin
import { playerMixin } from '@/common/js/mixin'
// 引入添加页面组件
import AddSong from '@/components/add-song/Add-song'
export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false
    }
  },
  computed: {
    playTitle() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '循环播放' : '随机播放'
    }
  },
  created() {
  },
  methods: {
    // 显示开始列表
    showPlayList() {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrentSong(this.currentSong)
      }, 20)
    },
    // 隐藏开始列表
    hidePlayList() {
      this.showFlag = false
    },
    // 当前播放音乐
    currentPlaySong(item) {
      return this.currentSong.id === item.id ? 'icon-play' : ''
    },
    // 点击歌曲,播放当前歌曲
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex(v => {
          return v.id === item.id
        })
      }
      this.setCurrentIndex(index)
    },
    // 打开音乐列表,滚动到当前播放音乐的位置
    scrollToCurrentSong(current) {
      let index = this.sequenceList.findIndex(v => {
        return v.id === current.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    },
    // 删除一首歌曲
    deleteOneSong(song) {
      this.deleteSong(song)
      // 如果没有歌曲了,直接隐藏列表
      if (!this.playlist.length) {
        this.hidePlayList()
      }
    },
    // 删除所有歌曲
    delAllSong() {
      // dialog
      this.$createDialog({
        type: 'confirm',
        title: '是否清空播放列表',
        confirmBtn: {
          text: '清空',
          active: true,
          disabled: false,
          href: 'javascript:;'
        },
        cancelBtn: {
          text: '取消',
          active: false,
          disabled: false,
          href: 'javascript:;'
        },
        onConfirm: () => {
          this.$createToast({
            type: 'ok',
            time: 1000,
            txt: '清空成功'
          }).show()
          this.deleteAllSong()
          this.hidePlayList()
        },
        onCancel: () => {
          this.$createToast({
            type: 'warn',
            time: 1000,
            txt: '取消清空'
          }).show()
        }
      }).show()
    },
    openAddSong() {
      this.$refs.addSong.show()
    },
    // 我喜欢音乐的Icon
    myLoveSongIcon(song) {
      let Flag = this.myLoveSongList.some(item => {
        return item.id === song.id
      })
      if (Flag) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    // 加入收藏
    collectList(item) {
      this.saveMyLoveSongList(item)
    }
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong === oldSong) {
        return
      }
      this.scrollToCurrentSong(newSong)
    }
  },
  components: {
    Scroll,
    AddSong
  }
}
</script>

<style lang="stylus">
@import '~@/common/stylus/variable.styl';

.list-fade-enter-active, .list-fade-leave-active {
  transition: opacity 0.3s;

  .list-wrapper {
    transition: all 0.3s;
  }
}

.list-fade-enter, .list-fade-leave-to {
  opacity: 0;

  .list-wrapper {
    transform: translate3d(0, 100%, 0);
  }
}

.play-list {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $color-background-d;
  z-index: 100;

  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        text-align: center;
        line-height: 30px;

        .icon {
          width: 30px;
          height: 30px;

          .play-state {
            font-size: 30px;
            color: $color-theme-d;
          }

          .trash {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }

        .text {
          flex: 1;
          color: $color-text-l;
          font-size: $font-size-medium-x;
        }
      }
    }

    .list-content {
      max-height: 240px;

      .list-box {
        .list-item {
          padding: 0 20px;
          display: flex;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-d;

          &.list-enter-active, &.list-leave-active {
            transition: all 0.1s;
          }

          &.list-enter, &.list-leave-to {
            opacity: 0;
            height: 0;
          }

          .text {
            flex: 1;
            line-height: 40px;
          }

          .icon {
            width: 30px;
            height: 40px;
            text-align: center;
            line-height: 40px;
            color: $color-theme;

            .icon-favorite {
              &.current {
                color: $color-sub-theme;
              }
            }
          }
        }
      }
    }

    .list-operate {
      margin: 30px 0;
      display: flex;
      justify-content: center;

      .add {
        display: flex;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 20px;
        font-size: $font-size-small;
        color: $color-text-l;

        .icon {
          padding-right: 3px;
        }
      }
    }

    .list-close {
      text-align: center;
      height: 50px;
      line-height: 50px;
      background: $color-background;

      .text {
        color: $color-text-l;
      }
    }
  }
}
</style>
