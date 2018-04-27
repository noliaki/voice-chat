<template lang="pug">
  .input-field
    .container
      textarea(v-model="inputText", @keyup.ctrl.enter="onEnter", @keyup.meta.enter="onEnter")
      button(v-if="validVoiceChat", type="button" @click.prevent="toggleRecognization", :class="{'is-active': isRecognizing}")
        i.fas.fa-microphone
    .notice ctrl + Enter で送信できます
</template>
<script>
export default {
  data () {
    return {
      inputText: ''
    }
  },
  methods: {
    onEnter (event) {
      if (!this.inputText) return

      this.pushMessage(this.inputText)
      this.inputText = ''
    }
  },
  props: {
    message: {
      type: String,
      required: true
    },
    isRecognizing: {
      type: Boolean,
      required: true
    },
    toggleRecognization: {
      type: Function,
      required: true
    },
    pushMessage: {
      type: Function,
      required: true
    },
    validVoiceChat: {
      type: Boolean,
      required: true
    }
  }
}
</script>
<style lang="stylus" scoped>
.input-field
  position fixed
  bottom 0
  left 0
  width 100%
  padding 10px 20px
  text-align center
  box-shadow 0 0 3px 1px lighten(#000, 80%)

textarea
  width calc(100% - 40px - 10px)
  vertical-align middle
  padding 0.6em
  font-size inherit
  border 2px solid #e0e0e0

button
  vertical-align middle
  padding 20px 10px
  font-size 24px
  background-color #f5f5f5
  border 1px solid #f0f0f0
  border-radius 20px
  margin-left 10px

  &.is-active
    color #f00
    background-color #fff

</style>
