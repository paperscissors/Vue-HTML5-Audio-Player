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
            playlist: null,
            speed: null,
            skip: false,
            back: true,
            next: true,
            width: false,
            enable_metadata: false,
            freeze_metadata: false,
            default_metadata: {"name":"A Topical Conversation With Trista Okel of Empower BodyCare","id":619,"podcast_name":"This is Cannabis","podcast_and_show_name":"This is Cannabis - A Topical Conversation With Trista Okel of Empower BodyCare","slug":"","link":"show/this-is-cannabis","description":"<p>In this episode Lee & Emma talk to Trista Okel, Founder and CEO of&nbsp;<a href=\"https://www.empowerbodycare.com/\" >Empower BodyCare</a>, a best-selling topical products company. We discuss her journey from activist to entrepreneur, how topical products can be a non-addictive approach to pain management, and why she sees topicals&nbsp;as an ambassador for breaking down cannabisu2019 stigma.</p>","episode_number":22,"preheader":"CURRENT EPISODE - EP22","more_info_links":{"Listen":"https://streaming.xray.fm/track/podcasts/9/619/This_Is_Cannabis_1-3-19_PODCASSST.mp3","RSS Feed":"http://xray.test/rss/podcast/this-is-cannabis","Visit Page":"https://xraypod.com/show/this-is-cannabis"},"image":"https://cdn.xray.fm/sites/podcasts/episode/xray_content_43342724-142B-4E3F-8E0A-A495961FD3BD.jpg"}
          }
      }
  },
  mounted: function () {
    this.$nextTick(function () {
      var script_tag = document.getElementById('embedded_player');

      if (script_tag) {
        this.settings.playlist = (script_tag.getAttribute("data-show-playlist") === 'true') || false;
        this.settings.speed = (script_tag.getAttribute("data-show-speed") === 'true') || false;
        this.settings.skip = (script_tag.getAttribute("data-show-skip") === 'true') || false;
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
