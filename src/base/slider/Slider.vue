<template>
  <swiper
    :options="swiperOption"
    ref='mySwiper'
    class="slider-box"
  >
    <swiper-slide
      class="slider-item"
      v-for="item in sliderData"
      :key="item.id"
    >
      <a
        :href="item.linkUrl"
        class="slider-link"
      >
        <img
          :src="item.picUrl"
          class="slider-image"
        >
      </a>
    </swiper-slide>

    <!-- 分页 -->
    <div
      class="swiper-pagination"
      slot='pagination'
    ></div>
  </swiper>
</template>

<script>
export default {
  data() {
    return {
      swiperOption: {
        notNextTick: true,
        loop: this.loop,
        initialSlide: 0,
        autoplay: {
          delay: this.interval,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        speed: 800,
        direction: 'horizontal',
        grabCursor: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          bulletClass: 'my-bullet',
          bulletActiveClass: 'my-bullet-active'
        }
      }
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    interval: {
      Number,
      default: 3000
    },
    sliderData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  activated() {
    this.swiper.autoplay.start()
  },
  beforeDestroy() {
    this.swiper.autoPlay.stop()
  },
  deactivated() {
    this.swiper.autoplay.stop()
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.slider-box {
  min-height: 1;
  width: 100%;

  .slider-item {
    .slider-link {
      display: block;
      width: 100%;

      .slider-image {
        display: block;
        width: 100%;
      }
    }
  }

  .swiper-pagination {
    /deep/ .my-bullet {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 8px;
      background: $color-text-l;
      margin: 0 5px;

      &.my-bullet-active {
        width: 16px;
        background: $color-text-ll;
      }
    }
  }
}
</style>
