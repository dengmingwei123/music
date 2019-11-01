<template>
  <div class="loading">
    <img src="./loading.gif">
    <p>正在载入</p>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
.loading {
  position: absolute;
  width: 100%;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);

  img {
    display: block;
    width: 30px;
    height: 30px;
    margin: 0 auto;
  }

  p {
    margin-top: 10px;
    text-align: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
