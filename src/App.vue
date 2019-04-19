<template>
  <div id="player_wrapper" >
    <Player file="https://streaming.xray.fm/track/podcasts/9/1294/this_is_cannabis_1-31-19_PODCAST_FINAL.mp3" :playlist="playlist" :settings="settings"/>
  </div>
</template>

<script>
import Player from './components/Player.vue'

export default {
  name: 'player_wrapper',
  data: function() {
      return {
          playlist: [
            {
              url: "https://streaming.xray.fm/track/podcasts/9/1294/this_is_cannabis_1-31-19_PODCAST_FINAL.mp3",
              name: "<strong>This Is Cannabis</strong>: Talking Outdoor Cultivation"
            },
            {
              url: "https://xraystreaming.sfo2.digitaloceanspaces.com/podcasts/11/1361/It%20Takes%20A%20Village%20To%20Bring%20People%20To%20Life%20ft.%20Ronnie%20a.k.a.%20BeSpeak.m4a.mp3",
              name: "<strong>The Future Of What</strong>: Kids Music and Smart Speakers"
            }
          ],
          settings: {
            playlist: true,
            speed: true,
            skip: true,
            previous: true,
            next: true,
            width: 600
          }
      }
  },
  computed: {

  },
  components: {
    Player
  }
}
</script>
