import { mapGetters } from 'vuex'
export const playListMixin = {
  mounted() {
    this.handlerPlaylist(this.playlist)
  },
  activated() {
    this.handlerPlaylist(this.playlist)
  },
  computed: {
    ...mapGetters(['playlist'])
  },
  methods: {
    handlerPlaylist(playlist) {
      throw new Error('component must implement handlerPlaylist method')
    }
  },
  watch: {
    playlist(newVal) {
      this.handlerPlaylist(newVal)
    }
  }
}
