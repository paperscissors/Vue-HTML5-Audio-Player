<template>
<div id="audio">
  <div class="audio-player">
    <div class="playback-controls">
      <button class="prev">Previous</button>
      <button v-on:click.prevent="playOrPause" title="Play/Pause" :class="{ play: !playing, pause: playing }" v-if="!isBuffering">
        Play/Pause
      </button>
<!--  -->
<div v-if="isBuffering && !firstPlay">
  <div class="loader loader--style3" title="2">
  <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
  <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
    <animateTransform attributeType="xml"
      attributeName="transform"
      type="rotate"
      from="0 25 25"
      to="360 25 25"
      dur="0.6s"
      repeatCount="indefinite"/>
    </path>
  </svg>
</div>
</div>
      <!--  -->
      <button class="next">Next</button>
    </div>
    <div class="current-track">

      <div class="scrub-time">

        <div class='scrub'>
          <div class="now-playing">
            Sample Podcast Show Name Goes Here -Season No. Episode No. and Title Goes Here
          </div>

          <vue-slider ref="slider" v-model="scrub" @callback="seek" tooltip="hover" :formatter="showTimeForPercent">
            <template v-slot:dot>
              <img src="data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='25' viewBox='0 0 7 25' width='7' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m0 0h7v25h-7z' fill='%23fff'/%3e%3c/svg%3e" class="custom-dot"/>
            </template>
          </vue-slider>
          <!-- <vue-slider ref="slider" v-model="scrub" @callback="seek" tooltip="hover" :formatter="showTimeForPercent"></vue-slider> -->
          <div class="time">
          {{ currentTime }} | {{ durationTime }}
          </div>
        </div>

      </div>
    </div>

    <div class="time-controls">
      time
    </div>
    <audio loop="false" ref="audiofile" :src="file" preload="auto" style="display: none;"></audio>
  </div>




<div class="control-grid">
  <div classs="speeds">
    <h4>Playback speed</h4>
    <button v-on:click.prevent="setSpeed('1')" :class="{ active: speedMatches('1.0') }">full speed</button>
    <button v-on:click.prevent="setSpeed('1.5')" :class="{ active: speedMatches('1.5') }">1.5x speed</button>
    <button v-on:click.prevent="setSpeed('2')" :class="{ active: speedMatches('2.0') }">2x speed</button>
  </div>

  <div classs="skip" style="margin-top: 20px;">
    <h4>Skip forward or back</h4>
    <button v-on:click.prevent="skip(-30)" >back 30</button>
    <button v-on:click.prevent="skip(30)">forward 30</button>
  </div>
</div>


<div class="players" style="margin-top: 20px;">
  <h4>Show play buttons</h4>
  <button :class="{ active: isActivePlayer(15) }" v-on:click.prevent="setStream" data-player="15" data-url="https://streaming.xray.fm/track/podcasts/9/1294/this_is_cannabis_1-31-19_PODCAST_FINAL.mp3">This is a show play button</button>
  <button :class="{ active: isActivePlayer(20) }" v-on:click.prevent="setStream" data-player="20" data-url="http://feeds.soundcloud.com/stream/579078861-the-non-profit-hour-nphh-s7e4-animal-aid.mp3">Another show play</button>
  <button :class="{ active: isActivePlayer(25) }" v-on:click.prevent="setStream" data-player="25" data-url="http://www.copyofcopy.com/audio/HeavyBreather_TheWeepingAlpha_02-14-19.mp3">{{ this.$attrs['data-player'] }}A third one</button>
  <button :class="{ active: isActivePlayer(35) }" v-on:click.prevent="setStream" data-player="35" data-url="https://xraystreaming.sfo2.digitaloceanspaces.com/podcasts/11/1296/Ep%2079.%20It%20Takeas%20A%20Village%20To%20Raise%20A%20Chanti%20ft.%20Chanti%20Darling.m4a.mp3">Probably a fourth</button>
</div>
  <!--  0 = NETWORK_EMPTY - audio/video has not yet been initialized
1 = NETWORK_IDLE - audio/video is active and has selected a resource, but is not using the network
2 = NETWORK_LOADING - browser is downloading data
3 = NETWORK_NO_SOURCE - no audio/video source found -->
  </div>
</template>

<script>

import vueSlider from 'vue-slider-component'

export default {
  name: 'Player',
  data: function() {
    return {
      audio: undefined,
      currentSeconds: 0,
      durationSeconds: 0,
      innerLoop: false,
      loaded: false,
      playing: false,
      previousVolume: 35,
      showVolume: false,
      volume: 100,
      scrub: 0,
      currentPlayer: false,
      firstPlay:true
    }
  },
  components: {
    vueSlider
  },
  props: {
    file: {
      type: String,
      default: null
    }
  },
  computed: {
    isBuffering: function() {
      return this.audio !== undefined && this.audio.networkState === 2;
    },
    currentTime: function currentTime() {
      return this.convertTimeHHMMSS(this.currentSeconds);
    },
    durationTime: function durationTime() {
      return this.convertTimeHHMMSS(this.durationSeconds);
    },
    percentComplete: function percentComplete() {
      return parseInt(this.currentSeconds / this.durationSeconds * 100);
    },
    muted: function muted() {
      return this.volume / 100 === 0;
    }
  },

  watch: {
    playing: function playing() {

    },
    volume: function volume() {
      this.showVolume = false;
      this.audio.volume = this.volume / 100;
    }
  },

  methods: {
    speedMatches: function(speed) {

      if (this.audio !== undefined) {
        return this.audio.playbackRate === parseFloat(speed);
      }

      return false;
    },
    convertTimeHHMMSS: function convertTimeHHMMSS(val) {
      var hhmmss = new Date(val * 1000).toISOString().substr(11, 8);

      let value = hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
      return value.replace(/^01+/, '1').replace(/^02+/, '2');
    },
    showTimeForPercent: function (value) {
      if (this.loaded) {
        if (!isNaN(parseInt(this.audio.duration * (value * 0.01)))) {
          value = this.convertTimeHHMMSS(parseInt(this.audio.duration * (value * 0.01)));
        }
      }

      return value;
      // return this.convertTimeHHMMSS();
    },
    playOrPause: function playOrPause() {
      this.firstPlay = false;
      this.playing = !this.playing;

      if (this.playing) {
        return this.audio.play();
      } else {
        this.audio.pause();
      }
    },
    setSpeed: function(speed) {
      this.audio.playbackRate = parseFloat(speed);
    },
    isActivePlayer: function(player) {
      return player === parseInt(this.currentPlayer);
    },
    skip: function(skip) {
      this.audio.currentTime = this.audio.currentTime + parseInt(skip);
      this.scrub = parseInt(this.audio.currentTime) / parseInt(this.audio.duration)*100;
    },
    download: function download() {
      this.stop();
      window.open(this.file, 'download');
    },
    load: function load() {
      if (this.audio.readyState >= 2) {
        this.loaded = true;
        this.durationSeconds = parseInt(this.audio.duration);

        return true;
      }

      return true;
    },
    setStream: function(e) {

      if (this.audio.src === e.currentTarget.dataset.url) {
        this.playOrPause();
      } else {
        this.scrub = 0;
        this.audio.src = e.currentTarget.dataset.url;
        this.currentPlayer = e.currentTarget.dataset.player;

        this.audio.load();

        this.audio.oncanplay = () => {
          this.playing = true;
          this.audio.play();
        };
      }
    },
    mute: function mute() {
      if (this.muted) {
        return this.volume = this.previousVolume;
      }

      this.previousVolume = this.volume;
      this.volume = 0;
    },
    seek: function seek() {
      this.audio.currentTime = parseInt(this.audio.duration * (this.scrub * 0.01));
    },
    stop: function stop() {
      this.playing = false;
      this.audio.currentTime = 0;
    },
    update: function update() {
      this.currentSeconds = parseInt(this.audio.currentTime);
    }
  },

  created: function created() {
    this.innerLoop = this.loop;
  },
  mounted: function mounted() {
    this.audio = this.$el.querySelectorAll('audio')[0];
    this.audio.addEventListener('timeupdate', this.update);
    this.audio.addEventListener('loadeddata', this.load);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700');
body {
  font-family: 'Roboto', sans-serif;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* real stuff */

.audio-player {
   width: 100%;
   background-color: #000;
   color: #fff;
   height: 80px;
   display: grid;
   align-items: center;
   text-align: left;
   grid-template-columns: 1fr 2.5fr 1fr;

   .playback-controls {
     padding-left: 40px;
     button {
       border: 0px;
       width: 40px;
       height: 40px;
       background-size: 100%;
       text-indent: -6000px;
       overflow:hidden;
       transition: all 0.4s ease-in-out;
       &:hover {
         cursor: pointer;
         opacity: 0.8;
       }
     }

     .prev {
       background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='40' viewBox='0 0 40 40' width='40' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='20' cy='20' r='19' stroke='%23fff' stroke-width='2' transform='matrix(-1 0 0 -1 40 40)'/%3e%3cg fill='%23fff'%3e%3cpath d='m27.5 29.2416-10.9015-8.7416 10.9015-8.7416z' stroke='%23fff' stroke-width='2'/%3e%3cpath d='m17.9999 31h5.44444v21h-5.44444z' transform='matrix(-1 0 0 -1 35.9998 62)'/%3e%3c/g%3e%3c/svg%3e");
       margin-right: 19px;
     }

     .play {
       background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='40' viewBox='0 0 40 40' width='40' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m32 19.5-18.75 10.8253v-21.65062z' fill='%23fff'/%3e%3ccircle cx='20' cy='20' r='19' stroke='%23fff' stroke-width='2'/%3e%3c/svg%3e");
       margin-right: 19px;
     }

     .pause {
       background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='40' viewBox='0 0 40 40' width='40' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='20' cy='20' r='19' stroke='%23fff' stroke-width='2'/%3e%3cg fill='%23fff'%3e%3cpath d='m13 9h5.44444v21h-5.44444z'/%3e%3cpath d='m22.5555 9h5.44444v21h-5.44444z'/%3e%3c/g%3e%3c/svg%3e");
       margin-right: 19px;
     }



     .next {
       background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='40' viewBox='0 0 40 40' width='40' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='20' cy='20' r='19' stroke='%23fff' stroke-width='2'/%3e%3cg fill='%23fff'%3e%3cpath d='m12.5 10.7583 10.9015 8.7417-10.9015 8.7416z' stroke='%23fff' stroke-width='2'/%3e%3cpath d='m22.0001 9h5.44444v21h-5.44444z'/%3e%3c/g%3e%3c/svg%3e");
     }
   }
   .current-track {


     .scrub {
       margin-top: 5px;
       display: grid;
       // grid-template-columns: 3fr 1fr;

       .now-playing {
         font-size: 14px;
         text-align: center;
         grid-column: 1;
         margin-bottom: 8px;
       }

       .vue-slider-component {
         grid-column: 1;
          grid-row: 2;
          max-width: 600px;


          .vue-slider {
            background-color: #666 !important;
            border-radius: 0px !important;

          }
          .custom-dot {
            margin-top: -4px !important;
          }

          .vue-slider-process {
            background-color: #c3c3c3;
          }

          .vue-slider-horizontal .vue-slider-dot {

              left: 9px !important;

          }

       }

       .time {
          font-size: 14px;
          grid-column: 2;
           grid-row: 2;
       }
     }
   }
}



.grid {

}

/* fpo stuff */
button {
  border: 2px solid #000;
  padding: 5px;
  background-color: white;
  margin-right: 3px;
}
button.active {
    background-color: pink;
}

.player-wrapper {
  padding-top: 20vh;
  align-items: center;
  background-color: #fff;
  display: grid;
  grid-auto-rows: 50px;

  justify-content: center;
  height: 20vh;
  width: 40vw;
  margin: 0 auto;
}

.player {
  width: 500px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.15);
  color: #404040;
  line-height: 1.5625;
}

.player-controls {
  display: flex;
}

.player-controls>div {
  border-right: 1px solid #e0e0e0;
}

.player-controls>div:last-child {
  border-right: none;
}

.player-controls>div a {
  color: #404040;
  display: block;
  line-height: 0;
  padding: 1em;
  text-decoration: none;
}

.player-progress {
  background-color: #e0e0e0;
  cursor: pointer;
  height: 50%;
  min-width: 200px;
  position: relative;
}

.player-progress .player-seeker {
  background-color: #404040;
  bottom: 0;
  left: 0;
  position: absolute;
  top: 0;
}

.player-time {
  display: flex;
  justify-content: space-between;
}

.player-time .player-time-current {
  font-weight: 700;
  padding-left: 5px;
}

.player-time .player-time-total {
  opacity: 0.5;
  padding-right: 5px;
}
</style>
