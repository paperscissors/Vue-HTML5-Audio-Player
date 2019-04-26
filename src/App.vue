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
          playlist: null,
          settings: {
            playlist: null,
            speed: false,
            skip: false,
            back: true,
            next: true,
            width: false,
            enable_metadata: false,
            freeze_metadata: false,
            default_metadata: false
          }
      }
  },
  created: function () {
    this.$nextTick(function () {
      var script_tag = document.getElementById('embedded_player');

      if (script_tag) {
        this.playlist = JSON.parse(script_tag.getAttribute('data-playlist')) || [];
        this.settings.default_metadata = JSON.parse(script_tag.getAttribute('data-default-metadata')) || false;
        this.settings.playlist = (script_tag.getAttribute("data-show-playlist") === 'true') || false;
        this.settings.speed = (script_tag.getAttribute("data-show-speed") === 'true') || false;
        this.settings.skip = (script_tag.getAttribute("data-show-skip") === 'true') || false;
        this.settings.freeze_metadata = (script_tag.getAttribute("data-freeze-metadata") === 'true') || false;
        this.settings.back = (script_tag.getAttribute("data-show-back") === 'false') ? false : (typeof this.playlist === 'object');
        this.settings.next = (script_tag.getAttribute("data-show-next") === 'false') ? false : (typeof this.playlist === 'object');
        this.settings.width = Number(script_tag.getAttribute("data-width")) || false;
        this.settings.enable_metadata = (script_tag.getAttribute("data-enable-metadata") === 'true') || false;
      }
    })
  },
  computed: {

  },
  components: {
    Player
  }
}
</script>
