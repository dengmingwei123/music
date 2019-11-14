<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <search-box
        ref="searchBox"
        @getSearchText='getSearchText'
      ></search-box>
    </div>
    <!-- 快捷入口 -->
    <div
      class="shortcut-wrapper"
      ref='shortcutWrapper'
      v-show="!searchText.length"
    >
      <scroll
        class='shortcut'
        :data='shortcut'
        ref='shortcut'
      >
        <div>
          <!-- 热门搜索 -->
          <div class="hot-key">
            <h1 class="hot-title">热门搜索</h1>
            <ul class='hot-list'>
              <li
                class='hot-item'
                v-for="hot in hotkey"
                :key='hot.n'
                @click="selectHot(hot.k)"
              >{{ hot.k }}</li>
            </ul>
          </div>

          <!-- 搜索历史 -->
          <div
            class="search-history"
            v-show="searchHistory.length>0"
          >
            <!-- 搜索标题 -->
            <h1 class="title">
              <p class='text'>搜索历史</p>
              <div
                class='clear'
                @click="delAllSearchHistory"
              >
                <i class='icon-clear'></i>
              </div>
            </h1>
            <!-- 搜索列表 -->
            <div class="search-list-wrapper">
              <search-list
                :searchs='searchHistory'
                @selectHistory='selectHot'
                @deleteSearchHistory='deleteSearchHistory'
              ></search-list>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <!-- 搜索结果 -->
    <div
      class="search-result"
      ref='searchResult'
      v-show="searchText"
    >
      <suggest
        :searchText='searchText'
        ref='suggest'
        @select='saveSearch'
      ></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
// 引入获取数据的方法
import { getHotKey } from '@/api/search'
import { ERR_OK } from '@/api/config'
// 引入搜索框组件
import SearchBox from '@/base/search-box/Search-box.vue'
// 引入搜索结果组件
import Suggest from '@/base/suggest/Suggest.vue'
// 引入历史记录组件
import SearchList from '@/base/search-list/Search-list.vue'
// 引入mixin
import { playListMixin, searchMixin } from '@/common/js/mixin'
// 引入map语法
import { mapActions } from 'vuex'
// 引入滚动组件
import Scroll from '@/base/scroll/Scroll'
export default {
  mixins: [playListMixin, searchMixin],
  data() {
    return {
      hotkey: [],
      searchText: ''
    }
  },
  created() {
    this._getHotKey()
  },
  computed: {
    shortcut() {
      return this.hotkey.concat(this.searchHistory)
    }
  },
  methods: {
    handlerPlaylist(playlist) {
      let offset = playlist.length > 0 ? '60px' : ''
      this.$refs.searchResult.style.bottom = offset
      this.$refs.shortcutWrapper.style.bottom = offset
      this.$refs.suggest.refresh()
    },
    // 获取热门搜索数据
    async _getHotKey() {
      let res = await getHotKey()
      let { code, data: { hotkey } } = res
      if (code === ERR_OK) {
        // 只保留前十条
        hotkey.forEach((hot, index) => {
          if (index < 10) {
            this.hotkey.push(hot)
          }
        })
      }
    },
    // 删除全部历史记录
    delAllSearchHistory() {
      // dialog
      this.$createDialog({
        type: 'confirm',
        title: '是否清空所有搜索历史',
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
          this.delSearchHistoryList()
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
    ...mapActions(['delSearchHistoryList'])
  },
  watch: {
    searchText(newVal) {
      if (!newVal) {
        // 手动刷新下scroll组件
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.search {
  .search-box-wrapper {
    padding: 0px 20px;
    margin: 20px 0;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 168px;
    bottom: 0;
    width: 100%;

    // 热门
    .hot-key {
      padding: 10px 20px 20px 20px;

      .hot-title {
        margin-bottom: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }

      .hot-list {
        display: flex;
        flex-wrap: wrap;

        .hot-item {
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          color: $color-text-d;
          background-color: $color-highlight-background;
          font-size: $font-size-medium;
        }
      }
    }

    .search-history {
      position: relative;
      padding: 0 20px;

      // 搜索历史标题
      .title {
        display: flex;
        color: $color-text-d;
        font-size: $font-size-medium;

        .text {
          flex: 1;
          line-height: 35px;
        }

        .clear {
          width: 34px;
          height: 35px;
          text-align: center;
          line-height: 35px;
        }
      }
    }
  }

  .search-result {
    position: fixed;
    top: 168px;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
