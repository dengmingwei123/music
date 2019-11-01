<template>
  <div class='singer'>
    <list-view
      :singerList='singerList'
      @getSelectSinger="getSelectSinger"
    ></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import Singer from '@/common/js/singer'

// 引入列表视图组件
import ListView from '@/base/listview/ListView.vue'

// 引入vuex中的map语法
import { mapMutations } from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  data() {
    return {
      singerList: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    // 获取子组件传来的歌手数据
    getSelectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    async _getSingerList() {
      let res = await getSingerList()
      let { code, data: { list } } = res
      if (code === ERR_OK) {
        this.singerList = this._normalizeSinger(list)
      }
    },
    // 更改数据格式
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((value, index) => {
        // 前十加入热门
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer(value.Fsinger_mid, value.Fsinger_name))
        }
        // 分组
        let key = value.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer(value.Fsinger_mid, value.Fsinger_name))
      })
      // 转为数组,并进行排序
      let hot = []
      let ret = []
      for (let key in map) {
        if (map[key].title === HOT_NAME) {
          hot.push(map[key])
        } else if (key.match(/[a-zA-Z]/)) {
          ret.push(map[key])
        }
      }
      // 进行排序
      ret.sort((a, b) => {
        // 转为uniCode编码
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // 将最终结果返回
      return hot.concat(ret)
    }
  },
  components: {
    ListView
  }
}
</script>

<style lang="stylus" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
