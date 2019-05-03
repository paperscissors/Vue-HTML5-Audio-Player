<template>
  <div >
    <Player :file="filename" :playlist="the_playlist" :settings="the_settings"/>
  </div>
</template>

<script>
import Player from './components/Player.vue'

export default {
  name: 'player_wrapper',
  props: ['playlist', 'settings', 'default_file'],
  data: function() {
      return {
          the_playlist: null,
          the_settings: {
            playlist: null,
            artwork: null,
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
        this.the_settings.playlist = (script_tag.getAttribute("data-show-playlist") === 'true') || false;
        this.the_settings.default_metadata = JSON.parse(script_tag.getAttribute('data-default-metadata')) || false;
        this.the_settings.artwork = script_tag.getAttribute("data-show-artwork") || false;
        var settings = document.getElementById('embedded_player_settings');

        try {
          var settings = JSON.parse(settings.innerText.trim());
        } catch (exception) {

        }

        if (settings !== undefined && settings.playlist !== undefined) {
          this.the_playlist = settings.playlist;
        }
        //this.the_playlist = JSON.parse(script_tag.getAttribute('data-playlist')) || [];

        this.the_settings.speed = (script_tag.getAttribute("data-show-speed") === 'true') || false;
        this.the_settings.skip = (script_tag.getAttribute("data-show-skip") === 'true') || false;
        this.the_settings.freeze_metadata = (script_tag.getAttribute("data-freeze-metadata") === 'true') || false;
        this.the_settings.back = (script_tag.getAttribute("data-show-back") === 'false') ? false : (typeof this.the_playlist === 'object');
        this.the_settings.next = (script_tag.getAttribute("data-show-next") === 'false') ? false : (typeof this.the_playlist === 'object');
        this.the_settings.width = Number(script_tag.getAttribute("data-width")) || false;
        this.the_settings.enable_metadata = (script_tag.getAttribute("data-enable-metadata") === 'true') || false;
      } else {
          this.the_playlist = this.playlist;
          this.the_settings = this.settings;
      }
    })
  },
  computed: {

    filename: function() {
      if (this.default_file) {
        return this.default_file;
      }

      if (this.playlist && this.the_playlist[0] !== undefined) {
        return this.the_playlist[0].url;
      }

      return null;
    }
  },
  components: {
    Player
  }
}
</script>
