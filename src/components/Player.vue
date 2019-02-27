<template>
<div id="audio">
  <div class="player-wrapper  ">


  <div class='scrub'>
    <vue-slider ref="slider" v-model="scrub" @callback="seek" tooltip="hover" :formatter="showTimeForPercent"></vue-slider>
  </div>
  <div class="player">
    <div class="player-controls">
      <div>
        <button v-on:click.prevent="playOrPause" title="Play/Pause">
<svg width="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
<path v-if="!playing" fill="currentColor" d="M15,10.001c0,0.299-0.305,0.514-0.305,0.514l-8.561,5.303C5.51,16.227,5,15.924,5,15.149V4.852c0-0.777,0.51-1.078,1.135-0.67l8.561,5.305C14.695,9.487,15,9.702,15,10.001z" />
<path v-else fill="currentColor" d="M15,3h-2c-0.553,0-1,0.048-1,0.6v12.8c0,0.552,0.447,0.6,1,0.6h2c0.553,0,1-0.048,1-0.6V3.6C16,3.048,15.553,3,15,3z M7,3H5C4.447,3,4,3.048,4,3.6v12.8C4,16.952,4.447,17,5,17h2c0.553,0,1-0.048,1-0.6V3.6C8,3.048,7.553,3,7,3z" />
</svg>
</button>
      </div>
      <div>
        <div v-on:click="seek" class="player-progress" title="Time played : Total time">

        </div>
        <div class="player-time">
          <div class="player-time-current">{{ currentTime }}</div>
          <div v-if="audio !== undefined && audio.networkState === 2 && !firstPlay">
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
          <div class="player-time-total">{{ durationTime }}</div>
        </div>
      </div>
      <div>
        <a v-on:click.prevent="mute" title="Mute" href="#">
<svg width="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
<path v-if="!muted" fill="currentColor" d="M5.312,4.566C4.19,5.685-0.715,12.681,3.523,16.918c4.236,4.238,11.23-0.668,12.354-1.789c1.121-1.119-0.335-4.395-3.252-7.312C9.706,4.898,6.434,3.441,5.312,4.566z M14.576,14.156c-0.332,0.328-2.895-0.457-5.364-2.928C6.745,8.759,5.956,6.195,6.288,5.865c0.328-0.332,2.894,0.457,5.36,2.926C14.119,11.258,14.906,13.824,14.576,14.156zM15.434,5.982l1.904-1.906c0.391-0.391,0.391-1.023,0-1.414c-0.39-0.391-1.023-0.391-1.414,0L14.02,4.568c-0.391,0.391-0.391,1.024,0,1.414C14.41,6.372,15.043,6.372,15.434,5.982z M11.124,3.8c0.483,0.268,1.091,0.095,1.36-0.388l1.087-1.926c0.268-0.483,0.095-1.091-0.388-1.36c-0.482-0.269-1.091-0.095-1.36,0.388L10.736,2.44C10.468,2.924,10.642,3.533,11.124,3.8z M19.872,6.816c-0.267-0.483-0.877-0.657-1.36-0.388l-1.94,1.061c-0.483,0.268-0.657,0.878-0.388,1.36c0.268,0.483,0.877,0.657,1.36,0.388l1.94-1.061C19.967,7.907,20.141,7.299,19.872,6.816z" />
<path v-else fill="currentColor" d="M14.201,9.194c1.389,1.883,1.818,3.517,1.559,3.777c-0.26,0.258-1.893-0.17-3.778-1.559l-5.526,5.527c4.186,1.838,9.627-2.018,10.605-2.996c0.925-0.922,0.097-3.309-1.856-5.754L14.201,9.194z M8.667,7.941c-1.099-1.658-1.431-3.023-1.194-3.26c0.233-0.234,1.6,0.096,3.257,1.197l1.023-1.025C9.489,3.179,7.358,2.519,6.496,3.384C5.568,4.31,2.048,9.261,3.265,13.341L8.667,7.941z M18.521,1.478c-0.39-0.391-1.023-0.391-1.414,0L1.478,17.108c-0.391,0.391-0.391,1.024,0,1.414c0.391,0.391,1.023,0.391,1.414,0l15.629-15.63C18.912,2.501,18.912,1.868,18.521,1.478z" />
</svg>
</a>
      </div>
      <div>
        <a v-on:click.prevent="" v-on:mouseenter="showVolume = true" title="Volume" href="#">
<svg width="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
<path fill="currentColor" d="M19,13.805C19,14.462,18.462,15,17.805,15H1.533c-0.88,0-0.982-0.371-0.229-0.822l16.323-9.055C18.382,4.67,19,5.019,19,5.9V13.805z" />
</svg>
<input v-model.lazy.number="volume" v-show="showVolume" type="range" min="0" max="100" />
</a>
      </div>
    </div>
    <audio loop="false" ref="audiofile" :src="file" preload="auto" style="display: none;"></audio>
  </div>

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

      return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
    },
    showTimeForPercent: function (value) {
      if (this.loaded) {
        if (!isNaN(parseInt(this.audio.duration * (value * 0.01)))) {
          return this.convertTimeHHMMSS(parseInt(this.audio.duration * (value * 0.01)))
        }

      } else {

        return value;
      }

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
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Nunito:400,700');
body {
  font-family: 'Nunito', sans-serif;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;

}

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
.scrub {
  width: 500px;

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
