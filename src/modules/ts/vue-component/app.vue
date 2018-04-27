<template lang="pug">
  #app
    header
      room(:make-room="makeRoom", :rooms="rooms", :roomKey="roomKey", :on-change-room-key="onChangeRoomKey")
      twitter-btn(:login-with-twitter="loginWithTwitter", :user-display-name="userDisplayName")
    section
      message-field(:messages="messages")
    footer(v-show="roomKey")
      inputField(
        :message="message",
        :is-recognizing="isRecognizing",
        :toggle-recognization="toggleRecognization",
        :push-message="pushMessage",
        :valid-voice-chat="validVoiceChat"
      )
</template>

<script>
import twitterBtn from './twitter-btn'
import inputField from './input/input-field'
import room from './room'
import messageField from './message/message-field'

const provider = new firebase.auth.TwitterAuthProvider()
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

const db = firebase.database()
const roomRef = db.ref('/rooms')

export default {
  data () {
    return {
      message: 'hoge',
      roomKey: '',
      roomName: '',
      rooms: [],
      message: '',
      messages: [],
      isRecognizing: false,
      userDisplayName: '',
      validVoiceChat: false
    }
  },
  components: {
    twitterBtn,
    inputField,
    room,
    messageField
  },
  watch: {
    roomKey (newName, oldName) {
      this.messages = []

      roomRef.child(newName).child('/messages').on('child_added', data => {
        this.messages.push({
          message: data.val().message,
          name: data.val().name
        })
      })
    }
  },
  methods: {
    onChangeMessage (message) {
      this.message = message
    },
    onChangeRoomKey (roomKey) {
      this.roomKey = roomKey
    },
    loginWithTwitter () {
      firebase.auth().signInWithPopup(provider).then(result => {
        const user = result.user;
        this.userDisplayName = user.displayName
      }).catch(error => {
        alert(error.code, error.message)
      })
    },
    makeRoom (name) {
      if (!name) return

      roomRef.push({ name })
    },
    submit (event) {
      this.pushMessage(this.message)
      this.message = ''
    },
    pushMessage(message) {
      roomRef.child(this.roomKey).child('/messages').push({
        message,
        name: this.userDisplayName || 'no name user'
      })
    },
    toggleContinuous (event) {
      console.log(event)
      this.continuous = event.target.checked
    },
    toggleRecognization () {
      if (this.isRecognizing) {
        this.recognition.stop()
        this.isRecognizing = false
        return
      }
      this.recognition.start()
    },
    onResult (event) {
      this.pushMessage(event.results[0][0].transcript)
    },
    onEnd (event) {
      if (this.continuous && this.isRecognizing) {
        this.recognition.start()
        return
      }
      this.isRecognizing = false
      console.log(event)
    },
    onStart (event) {
      this.isRecognizing = true
    },
    onError (event) {
      this.isRecognizing = false
    }
  },
  created () {
    if (!SpeechRecognition) return

    this.validVoiceChat = true

    this.recognition = new SpeechRecognition()
    this.recognition.continuous = false
    this.recognition.lang = 'ja'
    this.recognition.addEventListener('result', this.onResult, false)
    this.recognition.addEventListener('end', this.onEnd, false)
    this.recognition.addEventListener('start', this.onStart, false)
    this.recognition.addEventListener('error', this.onError, false)
  },
  mounted () {
    roomRef.on('child_added', data => {
      this.rooms.push({
        key: data.key,
        name: data.val().name
      })
    })
  }
}
</script>

<style lang="stylus" scoped>
header
  display flex
  justify-content center
  align-items center
  padding 10px 0
  height 51px
  border-bottom 1px solid #f0f0f0
</style>
