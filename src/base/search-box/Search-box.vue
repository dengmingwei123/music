<template>
  <div class='search-box'>
    <i class="icon icon-search"></i>
    <input
      type="text"
      class="search-bar"
      :placeholder="placeholderText"
      v-model='searchText'
    >
    <i
      class="icon icon-dismiss"
      v-show="searchText.length>0"
      @click='delSearchText'
    ></i>
  </div>
</template>

<script>
import { debounce } from '@/common/js/util'
export default {
  data() {
    return {
      searchText: ''
    }
  },
  props: {
    placeholderText: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  methods: {
    delSearchText() {
      this.searchText = ''
    },
    setSearchText(searchText) {
      this.searchText = searchText
    }
  },
  created() {
    this.$watch('searchText', debounce((newVal) => {
      this.$emit('getSearchText', newVal)
    }, 200))
  },
  watch: {
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.search-box {
  height: 40px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  background-color: $color-highlight-background;

  .icon {
    color: $color-background;

    &.icon-search {
      width: 24px;
      height: 24px;
      font-size: 24px;
    }

    &.icon-dismiss {
      width: 16px;
      height: 16px;
      font-size: $font-size-medium-x;
    }
  }

  .search-bar {
    flex: 1;
    font-size: $font-size-medium;
    background-color: $color-highlight-background;
    padding-left: 10px;
    outline-color: #fff;
    outline: none;
    color: #fff;
  }
}
</style>
