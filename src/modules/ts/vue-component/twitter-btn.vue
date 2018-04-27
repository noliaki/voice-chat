<template lang="pug">
  .container
    template(v-if="!userDisplayName")
      button.login(type="button", @click.prevent="loginWithTwitter")
        i.fab.fa-twitter
        | twitterでログイン
    template(v-else)
      | {{ userDisplayName }}
</template>
<script>
export default {
  props: {
    loginWithTwitter: {
      type: Function,
      required: true
    },
    userDisplayName: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  margin-left 30px
.login
  background-color #00aced
  color #ffffff
  font-size 14px
  padding 5px 10px
  border-radius 20px

i
  margin-right 5px
  vertical-align middle
  font-size 1.4em
</style>
