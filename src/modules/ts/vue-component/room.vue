<template lang="pug">
  .room
    .room-create
      input.room-create__input(v-model="roomName")
      button.room-create__btn(type="button", @click.prevent="onClick") make room
    .room-select
      select.room-select__select(name="roomKey", @change="onChangeRoomKey($event.target.value)", :value="roomKey")
        option(disabled, value="", selected) select room
        option(v-for="room in rooms" :value="room.key") {{ room.name }}
</template>

<script>
export default {
  props: {
    makeRoom: {
      type: Function,
      required: true
    },
    rooms: {
      type: Array,
      required: true
    },
    roomKey: {
      type: String,
      required: true
    },
    onChangeRoomKey: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      roomName: '',
    }
  },
  methods: {
    onChange (event) {
      console.log(event.target.value)
    },
    onClick (event) {
      this.makeRoom(this.roomName)
      this.roomName = ''
    }
  }
}
</script>
<style lang="stylus" scoped>
.room
  display flex
  align-items center
  text-align center

.room-create
  display flex
  justify-content center

.room-create__input
  border 1px solid #d0d0d0
  font-size inherit
  padding 3px 5px
  border-top-left-radius 7px
  border-bottom-left-radius 7px

.room-create__btn
  border 1px solid darken(#a3cf69, 20%)
  padding 0 5px
  background-color #a3cf69
  color darken(#a3cf69, 80%)
  border-top-right-radius 7px
  border-bottom-right-radius 7px

.room-select
  margin-left 20px

.room-select__select
  font-size inherit
</style>
