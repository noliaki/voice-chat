<template lang="pug">
  #app
    div
      button.login(type="button", @click.prevent="loginWithTwitter")
        i.fab.fa-twitter
        | twitterでログイン
    div(v-show="userDisplayName")
      div
        input(v-model="roomName")
        button(type="button" @click.prevent="makeRoom") make room
      div
        select(name="roomKey" v-model="roomKey")
          option(disabled, value="") select room
          option(v-for="room in rooms" :value="room.key") {{ room.name }}
      div(v-show="roomKey")
        textarea(v-model="message", @keyup.ctrl.enter="submit", @keyup.meta.enter="submit")
        button(type="button" @click.prevent="toggleRecognization")
          i.fas.fa-microphone(:class="{'is-active': isRecognizing}")
        ul
          li(v-for="item in messages") {{ item.name }} | {{ item.message }}
</template>

<script>
const provider = new firebase.auth.TwitterAuthProvider()
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

if (!SpeechRecognition) {
  throw alert(`
    お使いのブラウザではご利用できません。
    Google Chromeを使用してください。
  `)
}

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
      userDisplayName: ''
    }
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
    loginWithTwitter () {
      firebase.auth().signInWithPopup(provider).then(result => {
        const user = result.user;
        this.userDisplayName = user.displayName
      }).catch(error => {
        alert(error.code, error.message)
      })
    },
    makeRoom (event) {
      roomRef.push({
        name: this.roomName
      }).then(res => {
        this.roomName = ''
      })
    },
    submit (event) {
      this.pushMessage(this.message)
      this.message = ''
    },
    pushMessage(message) {
      roomRef.child(this.roomKey).child('/messages').push({
        message,
        name: this.userDisplayName
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
.login
  border 1px solid #00aaff
  border-radius 10px
  background-color darken(#0af, 10%)
  padding 3px 10px
  color #fff
</style>
