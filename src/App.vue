<template>
  <div id="app" style="background-color:#000">
    <Player file="https://streaming.xray.fm/track/podcasts/9/1294/this_is_cannabis_1-31-19_PODCAST_FINAL.mp3"/>
  </div>
</template>

<script>
import Player from './components/Player.vue'

export default {
  name: 'app',
  components: {
    Player
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
