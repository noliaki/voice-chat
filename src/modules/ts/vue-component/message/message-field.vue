<template lang="pug">
  .messages(ref="container")
    ul
      li(v-for="item in messages")
        .user {{ item.name }}
        .message {{ item.message }}
</template>

<script>
export default {
  props: {
    messages: {
      type: Array,
      required: true
    }
  },
  watch: {
    messages () {
      const nowScrollTop = this.$refs['container'].scrollTop

      if (nowScrollTop < this.$refs['container'].scrollHeight - this.$refs['container'].clientHeight) return

      this.$nextTick(() => {
        this.$refs['container'].scrollTop = this.$refs['container'].scrollHeight - this.$refs['container'].clientHeight
        console.log(this.$refs['container'].scrollTop)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.messages
  width 80%
  max-height calc(100vh - 120px - 80px)
  overflow-y scroll
  margin 10px auto

li
  border-right 1px solid #f0f0f0
  border-bottom 1px solid #f0f0f0
  border-left 1px solid #f0f0f0
  padding 10px

  &:first-child
    border-top 1px solid #f0f0f0

  &:nth-child(2n)
    background-color #fafafa

.user
  font-size 0.8em
  font-weight bold

.message
  color #000
</style>
