<template>
    <div class="audio-player">
        <div class="audio-player-grid">
            <div class="playback-controls">
                <button v-if="getSettings('previous')" aria-label="Play previous" class="prev" @click="previous">Previous</button>
                <button aria-label="Play/Pause audio" @mouseover="isPlayHovered = true" @mouseout="isPlayHovered = false" v-on:click.prevent="playOrPause" title="Play/Pause" :class="{ play: !playing, pause: playing }" v-if="!isBuffering || firstPlay">
                    Play/Pause
                </button>

                <button aria-label="Audio is buffering" class="buffering" v-if="isBuffering && !firstPlay">
                    buffering
                </button>
                <button v-if="getSettings('next')" aria-label="Play next" class="next" @click="next">Next</button>

                <template v-if="isMobile">
                    <button aria-label="Expand track info" class="expand" v-if="!expanded && metadata" @click="toggleExpand">Expand</button>
                    <button aria-label="Collapse track info" class="collapse" v-if="expanded" @click="toggleExpand">Expand</button>
                </template>
            </div>
            <div class="current-track" v-if="!isMobile">
                <div class="scrub-time">
                    <div class='scrub'>
                        <div class="now-playing" v-html="track_title">

                        </div>

                        <vue-slider ref="slider" v-model="scrub" @callback="seek" tooltip="hover" :formatter="showTimeForPercent" v-if="durationTime">
                            <template v-slot:dot>
                                <img alt="player time seek" src="data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='25' viewBox='0 0 7 25' width='7' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m0 0h7v25h-7z' fill='%23fff'/%3e%3c/svg%3e" class="custom-dot"/>
                            </template>
                        </vue-slider>
                        <div class="time" v-if="durationTime">
                            {{ currentTime }} | {{ durationTime }}
                        </div>
                    </div>

                </div>
            </div>

            <div class="time-controls" v-if="!isMobile && durationTime">
                <button aria-label="Toggle playback speed" class="speed button-override" @click="toggleSpeed" v-if="getSettings('speed')">
                    {{ playbackSpeedDisplay }}
                </button>

                <template v-if="getSettings('skip')">
                  <button aria-label="Skip back 30 seconds" class="skip-back" v-on:click.prevent="skip(-30)" ></button>
                  <button aria-label="Skip forward 30 seconds" class="skip-forward" v-on:click.prevent="skip(30)"></button>
                </template>
                <button aria-label="Expand track info" class="expand" v-if="!expanded && metadata" @click="toggleExpand">Expand</button>
                <button aria-label="Collapse track info" class="collapse" v-if="expanded" @click="toggleExpand">Collapse</button>
            </div>

        </div>

        <audio id='audioplayer' loop="false" ref="audiofile" :src="file" preload="auto" style="display: none;"></audio>
        <transition name="fade">
            <div class="details" v-if="expanded && metadata">
                <div class="meta-grid" ref="metaGrid">
                    <div class="artwork">
                        <img :src="metadata.image" :alt="metadata.podcast_and_show_name">
                    </div>

                    <div class="text">
                        <div class="controls" v-if="isMobile">
                            <div class="playback">
                                <div class="now-playing" v-html="track_title">

                                </div>

                                <div class="current-track" v-if="durationTime">
                                    <div class="scrub-time">
                                        <div class='scrub'>
                                            <vue-slider ref="slider" v-model="scrub" @callback="seek" tooltip="hover" :formatter="showTimeForPercent">
                                                <template v-slot:dot>
                                                    <img alt="player time seek" src="data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='10' viewBox='0 0 7 25' width='7' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m0 0h7v25h-7z' fill='%23fff'/%3e%3c/svg%3e" class="custom-dot"/>
                                                </template>
                                            </vue-slider>
                                            <div class="time">
                                                {{ currentTime }} | {{ durationTime }}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div class="play-buttons">
                                <button aria-label="Play previous" class="prev">Previous</button>
                                    <button  @mouseover="isPlayHovered = true" @mouseout="isPlayHovered = false" v-on:click.prevent="playOrPause" title="Play/Pause" :class="{ play: !playing, pause: playing }" v-if="!isBuffering || firstPlay">
                                        Play/Pause
                                    </button>

                                    <button aria-label="Buffering" class="buffering" v-if="isBuffering && !firstPlay">
                                        buffering
                                    </button>
                                <button aria-label="Play next" class="next">Next</button>
                                </div>
                            </div>

                            <div class="time-controls" v-if="durationTime">
                                <button aria-label="Toggle audio speed" class="speed button-override" @click="toggleSpeed" >
                                    {{ playbackSpeedDisplay }}
                                </button>

                                <div class="skips">
                                    <button aria-label="Skip back 30 seconds" class="skip-back" v-on:click.prevent="skip(-30)" ></button>
                                    <button aria-label="Skip forward 30 seconds" class="skip-forward" v-on:click.prevent="skip(30)"></button>
                                </div>
                            </div>
                        </div>
                        <h5 v-if="!isMobile">{{ metadata.name }}</h5>
                        <h1 v-if="!isMobile">{{ metadata.podcast_name }}</h1>
                        <p v-if="!isMobile" v-html="metaDescription"></p>
                        <p v-if="!isMobile" class="more-info-links">
                            <!--<router-link :to="moreEpisodes">-->
                                <!--VIEW MORE EPISODES-->
                            <!--</router-link>-->

                            <a v-if="typeof metadata.more_info_links !== 'undefined'" :href="metadata.more_info_links['RSS Feed']" target="_blank">
                                RSS FEED
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </transition>

        <div v-if="getSettings('playlist')" class="playlist">
          <h4>Playlist</h4>
            <ul>
              <li v-for="track in playlist">

                <button class="standalone-button" :data-url="track.url" :data-name="track.name" @click="setStream" v-html="track.name"></button>
              </li>
            </ul>
        </div>
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
                firstPlay:true,
                playbackSpeed: 1,
                expanded: false,
                isPlayHovered: false,
                windowWidth: 0,
                isBuffering: false,
                track_title: this.getSettings('playlist') ? this.playlist[0].name : this.now_playing
            }
        },
        components: {
            vueSlider
        },
        props: ['now_playing','artwork','link','file','playlist', 'metadata', 'router', 'isPlaying', 'settings'],
        computed: {
            currentTime: function currentTime() {
                if (Number.isInteger(this.currentSeconds)) {
                    return this.convertTimeHHMMSS(this.currentSeconds);
                }

                return false;
            },
            durationTime: function durationTime() {
                if (Number.isInteger(this.durationSeconds)) {
                    return this.convertTimeHHMMSS(this.durationSeconds);
                }

                return false;
            },
            percentComplete: function percentComplete() {
                return parseInt(this.currentSeconds / this.durationSeconds * 100);
            },
            muted: function muted() {
                return this.volume / 100 === 0;
            },
            playbackSpeedDisplay: function() {
                let speed;

                if (Number.isInteger(this.playbackSpeed)) {
                    speed = this.playbackSpeed + ".00"
                } else {
                    speed = this.playbackSpeed.toString();
                    if (speed.slice(-2) == ".5") speed = speed + "0";
                }
                return speed + "X";
            },
            metaDescription: function() {

                var div = document.createElement("div");
                div.innerHTML = this.metadata.description;
                var text = div.textContent || div.innerText || "";

                return (text.length > 320) ? text.substr(0, 320-1) + '&hellip;' : text;
            },
            isMobile: function() {
                return (this.windowWidth !== 0 && this.windowWidth <= 823);
            }

        },

        watch: {
            isPlaying: function(before, after) {
                this.playing = true;
                this.firstPlay = false;
                this.scrub = 0;
                if (this.isMobile) {
                    this.expanded = this.playing;
                    this.$emit('expanded', this.playing);
                }
            },
            file: function(before, after) {
                this.scrub = 0;
                // this.audio.src = after;
                this.playing = true;
                this.audio.playbackRate = this.playbackSpeed;

                 //TODO: this could maybe cause problems with playlist handling
            },
            playing: function playing() {
                // this.toggleExpandedOnMobile();
            },
            volume: function volume() {
                this.showVolume = false;
                this.audio.volume = this.volume / 100;
            }
        },

        methods: {
          getSettings: function(value) {
            if (this.settings[value] !== undefined) {
              return this.settings[value];
            }

            return true;
          },
            previous: function() {
                let current_position = this.playlist.findIndex(x => x.url === this.audio.src);

                if (current_position > 0) {
                    this.startNewPlayback(this.playlist[current_position-1].url);
                    this.$emit('change-playlist-position', current_position-1);
                }

                return false;
            },
            next: function() {
              console.log(this.playlist);
                let current_position = this.playlist.findIndex(x => x.url === this.audio.src);
                let max_position = this.playlist.length - 1;

                if (current_position < max_position) {
                    this.startNewPlayback(this.playlist[current_position+1].url);
                    this.$emit('change-playlist-position', current_position+1);
                }

                return false;
            },
            toggleExpand: function(e) {
                this.expanded = !this.expanded;
                this.$emit('expanded', this.expanded);
            },
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
/*
                    document.getElementById('audioplayer').removeEventListener('canplay', this.$parent.playAudioElement);
                    document.getElementById('audioplayer').removeEventListener('stalled', this.$parent.playAudioElement);*/

                    if (this.isMobile) {
                        console.log('is this being triggered')
                        this.expanded = this.playing;
                        this.$emit('expanded', this.playing);
                    }
                    return this.audio.play();
                } else {
                    this.audio.pause();
                }
            },
            toggleExpandedOnMobile() {
                console.log(this.isMobile, this.expanded, this.playing);
                if (this.isMobile && !this.expanded && !this.playing) { //
                    this.expanded = true;
                    this.$emit('expanded', true);
                }

                if (this.isMobile && this.expanded && this.playing) { //
                    this.expanded = false;
                    this.$emit('expanded', false);
                }
            },
            toggleSpeed: function() {
                if (this.playbackSpeed < 2) {
                    this.playbackSpeed = this.playbackSpeed + 0.25;
                } else {
                    this.playbackSpeed = 1;
                }

                this.audio.playbackRate = this.playbackSpeed;
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
                    this.startNewPlayback(e.currentTarget.dataset.url);
                    if (e.currentTarget.dataset.name !== undefined) {
                      this.track_title = e.currentTarget.dataset.name;
                    }
                }
            },
            startNewPlayback: function(src) {
                this.scrub = 0;
                this.audio.src = src;

                // if (player) this.currentPlayer = e.currentTarget.dataset.player;

                this.audio.load();

                this.audio.oncanplay = () => {
                    this.playing = true;
                    this.audio.play();
                };
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
            },
            getWindowWidth(event) {
                this.windowWidth = window.innerWidth;
            }
        },

        created: function created() {
            this.innerLoop = this.loop;
            /*this.$root.$on('mobile-open', (e) => {

                console.log("open file", e);
                // Determine if popover should close, etc.
                this.toggleExpandedOnMobile();
            });*/
        },
        mounted: function mounted() {
            this.audio = this.$el.querySelectorAll('audio')[0];
            this.audio.addEventListener('timeupdate', this.update);
            this.audio.addEventListener('loadeddata', this.load);
            this.audio.addEventListener('playing', () => {
                this.isBuffering = false;
                // this.isBuffering = this.audio.networkState === 3;
            });

            this.audio.addEventListener('loadstart', () => {
                this.isBuffering = true;
            });

            this.$nextTick(() => {
                window.addEventListener('resize', this.getWindowWidth);
                this.getWindowWidth()
            })
        },
        destroyed: function() {
            window.removeEventListener('resize', this.getWindowWidth);
            this.audio.removeEventListener('loadeddata', this.load);
            this.audio.removeEventListener('playing', function(){});
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    @mixin button-style {
        button:not(.button-override) {
            border: 0px;
            width: 28px;

            @media (max-width: 640px) {
                width: 23px;
            }

            height: 28px;
            background-size: 100%;
            text-indent: -6000px;
            overflow:hidden;
            transition: opacity 0.4s ease-in-out;
            background-repeat: no-repeat;
            &:hover {
                cursor: pointer;
                opacity: 0.8;
            }
            background-position: center;
        }
    }

    .audio-player {
        width: 100%;
        color: #fff;

        .audio-player-grid {

            text-align: left;
            background-color: #000;
            min-height: 70px;

            @media (min-width: 824px) {
                display: grid;
                align-items: center;
                grid-template-columns: 1fr 3.1fr 1fr;
                grid-column-gap: 20px;
            }

            @media (min-width: 641px) and (max-width: 823px) {
                display: grid;
                align-items: center;
                margin-top: 10px;
                grid-template-columns: 1fr;
                grid-column-gap: 20px;
            }

        }


        .playback-controls {

            @media (min-width: 641px) {
                padding-left: 40px;
            }

            @include button-style;

            .prev {
                background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='40' viewBox='0 0 40 40' width='40' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='20' cy='20' r='19' stroke='%23fff' stroke-width='2' transform='matrix(-1 0 0 -1 40 40)'/%3e%3cg fill='%23fff'%3e%3cpath d='m27.5 29.2416-10.9015-8.7416 10.9015-8.7416z' stroke='%23fff' stroke-width='2'/%3e%3cpath d='m17.9999 31h5.44444v21h-5.44444z' transform='matrix(-1 0 0 -1 35.9998 62)'/%3e%3c/g%3e%3c/svg%3e");
                margin-right: 6px;
            }

            .play {
                background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='40' viewBox='0 0 40 40' width='40' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m32 19.5-18.75 10.8253v-21.65062z' fill='%23fff'/%3e%3ccircle cx='20' cy='20' r='19' stroke='%23fff' stroke-width='2'/%3e%3c/svg%3e");
                margin-right: 6px;
            }

            .buffering {
                background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg height='40' viewBox='0 0 40 40' width='40' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m20 39c10.4934102 0 19-8.5065898 19-19 0-10.49341025-8.5065898-19-19-19-10.49341025 0-19 8.50658975-19 19' fill='none' stroke='%23fff' stroke-width='2'/%3e%3c/svg%3e") no-repeat;
                margin-right: 6px;
                -webkit-animation: rotation 2s infinite linear;
                animation: rotation 2s infinite linear;
            }

            .pause {
                background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='40' viewBox='0 0 40 40' width='40' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='20' cy='20' r='19' stroke='%23fff' stroke-width='2'/%3e%3cg fill='%23fff'%3e%3cpath d='m13 9h5.44444v21h-5.44444z'/%3e%3cpath d='m22.5555 9h5.44444v21h-5.44444z'/%3e%3c/g%3e%3c/svg%3e");
                margin-right: 6px;
            }

            .next {
                background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='40' viewBox='0 0 40 40' width='40' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='20' cy='20' r='19' stroke='%23fff' stroke-width='2'/%3e%3cg fill='%23fff'%3e%3cpath d='m12.5 10.7583 10.9015 8.7417-10.9015 8.7416z' stroke='%23fff' stroke-width='2'/%3e%3cpath d='m22.0001 9h5.44444v21h-5.44444z'/%3e%3c/g%3e%3c/svg%3e");
            }

            .expand {
                margin-left: 5px;
                background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg width='40px' height='40px' viewBox='0 0 40 40' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3c!-- Generator: Sketch 53.2 (72643) - https://sketchapp.com --%3e%3ctitle%3eplayer-expand%3c/title%3e%3cdesc%3eCreated with Sketch.%3c/desc%3e%3cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3e%3cg id='player-expand' transform='translate(1.000000, 1.000000)'%3e%3ccircle id='Oval' stroke='%23FFFFFF' stroke-width='2' transform='translate(19.000000, 19.000000) rotate(90.000000) translate(-19.000000, -19.000000) ' cx='19' cy='19' r='19'%3e%3c/circle%3e%3cpath d='M11.32,15.0167 L11.32,12.1367 L19.24,17.2727 L27.064,12.1367 L27.064,15.0167 L19.24,20.3927 L11.32,15.0167 Z M11.32,22.0727 L11.32,19.1927 L19.24,24.3287L27.064,19.1927 L27.064,22.0727 L19.24,27.4487 L11.32,22.0727 Z' id='Shape' fill='%23FFFFFF' fill-rule='nonzero'%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/svg%3e") no-repeat;
            }

            .collapse {
                margin-left: 5px;
                background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='20' cy='20' r='19' stroke='white' stroke-width='2'/%3e%3crect x='26.8492' y='12' width='3' height='21' transform='rotate(45 26.8492 12)' fill='white'/%3e%3crect x='28.9706' y='26.8492' width='3' height='21' transform='rotate(135 28.9706 26.8492)' fill='white'/%3e%3c/svg%3e");
            }
        }
        .current-track {
            .scrub {
                margin-top: 5px;
                display: grid;
                grid-template-columns: 2.6fr 1.2fr;

                .now-playing {
                    font-size: 14px;
                    /*visibility: hidden;*/
                    text-align: center;
                    grid-column: 1;
                    margin-bottom: 5px;
                    transition: all 0s linear 300ms, opacity 300ms;
                }

                .now-playing.visible {
                    opacity: 1;
                    visibility: visible;
                }

                .vue-slider-component {
                    grid-column: 1;
                    grid-row: 2;
                    max-width: 600px;

                    .vue-slider-process {
                        border-radius: 0px;
                    }
                    .vue-slider-tooltip {
                        background-color: #39b54a;
                        border: 0px;
                        border-radius: 0px;
                        &::before {
                            display: none !important;
                        }
                    }

                    .vue-slider {
                        background-color: rgba(102,102,102, 0.5) !important;

                        border-radius: 0px !important;

                    }
                    .custom-dot {
                        margin-top: -7px !important;
                        @media (max-width: 640px) {
                            margin-top: -2px !important;
                        }
                        margin-left: 4px !important;
                    }

                    .vue-slider-process {
                        background-color: #c3c3c3;
                    }
                }

                .time {
                    font-size: 14px;
                    grid-column: 2;
                    grid-row: 2;
                }
            }
        }
        .time-controls {
            display: flex;
            .speed {
                background-color: transparent !important;
                outline:none;
                border: none;
                color: #ffffff;
                border: 0px !important;

                font-size: 28px;
                &:hover {
                    cursor: pointer;
                }
            }

            @include button-style;

            .skip-forward {
                width:45px !important;
                height: 45px !important;
                padding: 0px;
                margin-top: 5px;
                background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='51' viewBox='0 0 59 51' width='59' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m28.6446 5.80873c-8.142.36006-15.5136 6.05037-17.7804 14.51047-2.78636 10.3986 3.1902 21.0272 13.3554 23.751 10.1653 2.7237 20.6554-3.4926 23.4417-13.8912' stroke='%23fff' stroke-miterlimit='10' stroke-width='2'/%3e%3cg fill='%23fff'%3e%3cpath d='m25.6403 9.33069 1.8255-3.46463-1.174-3.71364 8.0141 4.27556z'/%3e%3cpath d='m24.2843 25.408h.9502c.597-.0091 1.0664-.1663 1.4082-.4717.3418-.3053.5127-.7177.5127-1.2373 0-1.1666-.5811-1.75-1.7432-1.75-.5468 0-.9843.1573-1.3125.4717-.3235.3099-.4853.7223-.4853 1.2373h-1.2647c0-.7884.2871-1.4424.8614-1.9619.5787-.5241 1.3125-.7861 2.2011-.7861.9388 0 1.6748.2483 2.208.7451.5332.4967.7998 1.1872.7998 2.0713 0 .4329-.1412.8522-.4238 1.2578-.278.4056-.6585.7087-1.1416.9092.5469.1731.9684.4603 1.2647.8613.3007.401.4511.891.4511 1.4697 0 .8933-.2916 1.6019-.875 2.126-.5833.5241-1.3421.7861-2.2763.7861-.9343 0-1.6953-.2529-2.2832-.7588-.5834-.5058-.875-1.1735-.875-2.0029h1.2714c0 .5241.1709.9434.5127 1.2578.3418.3145.7998.4717 1.3741.4717.6106 0 1.0778-.1595 1.4013-.4785.3236-.319.4854-.777.4854-1.374 0-.5788-.1777-1.0231-.5332-1.333s-.8682-.4694-1.5381-.4786h-.9502zm12.2637 1.3467c0 1.4811-.253 2.5817-.7588 3.3018-.5059.72-1.2966 1.08-2.3721 1.08-1.0618 0-1.848-.3509-2.3584-1.0527-.5104-.7064-.7747-1.7591-.793-3.1582v-1.6885c0-1.4629.253-2.5498.7588-3.2607.5059-.711 1.2989-1.0664 2.3789-1.0664 1.071 0 1.8594.344 2.3653 1.0322.5058.6836.7656 1.7409.7793 3.1719zm-1.2647-1.7295c0-1.071-.1504-1.8503-.4511-2.3379-.3008-.4922-.7771-.7383-1.4288-.7383-.6471 0-1.1188.2439-1.415.7315s-.4489 1.2373-.458 2.249v2.0234c0 1.0756.1549 1.8708.4648 2.3858.3145.5104.7885.7656 1.4219.7656.6244 0 1.0869-.2415 1.3877-.7246.3053-.4831.4649-1.2441.4785-2.2832z'/%3e%3c/g%3e%3c/svg%3e") no-repeat;
            }
            .skip-back {
                width:45px !important;
                height: 45px !important;
                margin-top: 5px;
                padding: 0px;
                background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='51' viewBox='0 0 58 51' width='58' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m29.5918 5.80867c8.1421.36006 15.5136 6.05033 17.7805 14.51043 2.7863 10.3987-3.1903 21.0272-13.3555 23.751s-20.6554-3.4925-23.4417-13.8912' stroke='%23fff' stroke-miterlimit='10' stroke-width='2'/%3e%3cg fill='%23fff'%3e%3cpath d='m32.5962 9.33063-1.8256-3.46463 1.1741-3.71364-8.0141 4.27556z'/%3e%3cpath d='m23.2842 25.4082h.9502c.597-.0091 1.0664-.1663 1.4082-.4717.3418-.3053.5127-.7177.5127-1.2373 0-1.1666-.5811-1.75-1.7432-1.75-.5469 0-.9844.1572-1.3125.4717-.3236.3099-.4853.7223-.4853 1.2373h-1.2647c0-.7884.2871-1.4424.8613-1.9619.5788-.5241 1.3125-.7861 2.2012-.7861.9388 0 1.6748.2483 2.208.7451.5332.4967.7998 1.1871.7998 2.0713 0 .4329-.1413.8522-.4238 1.2578-.278.4056-.6585.7086-1.1416.9092.5469.1731.9684.4602 1.2646.8613.3008.401.4512.8909.4512 1.4697 0 .8932-.2917 1.6019-.875 2.126s-1.3421.7861-2.2764.7861c-.9342 0-1.6953-.2529-2.2832-.7588-.5833-.5058-.875-1.1735-.875-2.0029h1.2715c0 .5241.1709.9434.5127 1.2578.3418.3145.7998.4717 1.374.4717.6107 0 1.0778-.1595 1.4014-.4785s.4854-.777.4854-1.374c0-.5788-.1778-1.0232-.5332-1.3331-.3555-.3099-.8682-.4694-1.5381-.4785h-.9502zm12.2637 1.3467c0 1.4811-.253 2.5817-.7588 3.3017-.5059.7201-1.2966 1.0801-2.3721 1.0801-1.0619 0-1.848-.3509-2.3584-1.0527-.5104-.7064-.7747-1.7591-.793-3.1582v-1.6885c0-1.4629.253-2.5498.7588-3.2607.5059-.711 1.2988-1.0664 2.3789-1.0664 1.071 0 1.8594.344 2.3653 1.0322.5058.6836.7656 1.7409.7793 3.1719zm-1.2647-1.7295c0-1.071-.1504-1.8503-.4512-2.3379-.3008-.4922-.777-.7383-1.4287-.7383-.6471 0-1.1188.2438-1.415.7315-.2962.4876-.4489 1.2373-.458 2.249v2.0234c0 1.0755.1549 1.8708.4648 2.3858.3145.5104.7884.7656 1.4219.7656.6243 0 1.0869-.2415 1.3877-.7246.3053-.4831.4648-1.2442.4785-2.2832z'/%3e%3c/g%3e%3c/svg%3e") no-repeat;
            }

            .expand {
                margin-left: 5px;
                margin-top: 9px;
                background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg width='40px' height='40px' viewBox='0 0 40 40' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3c!-- Generator: Sketch 53.2 (72643) - https://sketchapp.com --%3e%3ctitle%3eplayer-expand%3c/title%3e%3cdesc%3eCreated with Sketch.%3c/desc%3e%3cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3e%3cg id='player-expand' transform='translate(1.000000, 1.000000)'%3e%3ccircle id='Oval' stroke='%23FFFFFF' stroke-width='2' transform='translate(19.000000, 19.000000) rotate(90.000000) translate(-19.000000, -19.000000) ' cx='19' cy='19' r='19'%3e%3c/circle%3e%3cpath d='M11.32,15.0167 L11.32,12.1367 L19.24,17.2727 L27.064,12.1367 L27.064,15.0167 L19.24,20.3927 L11.32,15.0167 Z M11.32,22.0727 L11.32,19.1927 L19.24,24.3287L27.064,19.1927 L27.064,22.0727 L19.24,27.4487 L11.32,22.0727 Z' id='Shape' fill='%23FFFFFF' fill-rule='nonzero'%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/svg%3e") no-repeat;
            }

            .collapse {
                margin-left: 5px;
                margin-top: 9px;
                background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='20' cy='20' r='19' stroke='white' stroke-width='2'/%3e%3crect x='26.8492' y='12' width='3' height='21' transform='rotate(45 26.8492 12)' fill='white'/%3e%3crect x='28.9706' y='26.8492' width='3' height='21' transform='rotate(135 28.9706 26.8492)' fill='white'/%3e%3c/svg%3e");
            }
        }

        .meta-grid {
            width: 100%;
            padding-top: 35px;


            @media (min-width: 824px) {
                display: grid;
                grid-template-columns: 1.3fr 1.5fr 1fr;
                grid-column-gap: 25px;
            }

            @media (min-width: 456px) and (max-width: 823px) {
                display: grid;
                grid-template-columns: 1fr 2fr;
                grid-column-gap: 25px;
                width: 90vw;
                position: fixed;
                left:0;
            }

            @media (min-width: 455px) and (max-width: 508px) {
                display: grid;
                grid-template-columns: 1fr 3fr;
                grid-column-gap: 25px;
            }

            @media (max-width: 400px) {
                width: 100vw;
            }

            @media (max-width: 320px) {
                padding-top: 0px !important;
                .artwork {
                    img {
                        width: 70vw !important;
                    }
                }
            }

            @media (max-width: 400px) {
                .scrub {
                    grid-template-columns: 2.2fr 1.3fr;
                }
            }

                .controls {
                    margin-top: 15px;
                    display: grid;

                    @include button-style;
                    button:not(.button-override) {
                        width: 50px !important;
                        height: 50px !important;
                    }

                    justify-content: center;

                    .play-buttons {
                        margin: 0 auto;
                        margin-top: 25px;
                        width: 300px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .prev {
                        background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='40' viewBox='0 0 40 40' width='40' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='20' cy='20' r='19' stroke='%23fff' stroke-width='2' transform='matrix(-1 0 0 -1 40 40)'/%3e%3cg fill='%23fff'%3e%3cpath d='m27.5 29.2416-10.9015-8.7416 10.9015-8.7416z' stroke='%23fff' stroke-width='2'/%3e%3cpath d='m17.9999 31h5.44444v21h-5.44444z' transform='matrix(-1 0 0 -1 35.9998 62)'/%3e%3c/g%3e%3c/svg%3e");
                        margin-right: 20px;
                    }

                    .play {
                        background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='40' viewBox='0 0 40 40' width='40' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m32 19.5-18.75 10.8253v-21.65062z' fill='%23fff'/%3e%3ccircle cx='20' cy='20' r='19' stroke='%23fff' stroke-width='2'/%3e%3c/svg%3e");
                        margin-right: 20px;
                    }

                    .pause {
                        background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='40' viewBox='0 0 40 40' width='40' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='20' cy='20' r='19' stroke='%23fff' stroke-width='2'/%3e%3cg fill='%23fff'%3e%3cpath d='m13 9h5.44444v21h-5.44444z'/%3e%3cpath d='m22.5555 9h5.44444v21h-5.44444z'/%3e%3c/g%3e%3c/svg%3e");
                        margin-right: 20px;
                    }

                    .next {
                        background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='40' viewBox='0 0 40 40' width='40' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='20' cy='20' r='19' stroke='%23fff' stroke-width='2'/%3e%3cg fill='%23fff'%3e%3cpath d='m12.5 10.7583 10.9015 8.7417-10.9015 8.7416z' stroke='%23fff' stroke-width='2'/%3e%3cpath d='m22.0001 9h5.44444v21h-5.44444z'/%3e%3c/g%3e%3c/svg%3e");
                    }

                    .buffering {
                        background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg height='40' viewBox='0 0 40 40' width='40' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m20 39c10.4934102 0 19-8.5065898 19-19 0-10.49341025-8.5065898-19-19-19-10.49341025 0-19 8.50658975-19 19' fill='none' stroke='%23fff' stroke-width='2'/%3e%3c/svg%3e") no-repeat;
                        margin-right: 6px;
                        -webkit-animation: rotation 2s infinite linear;
                        animation: rotation 2s infinite linear;
                    }

                    .time-controls {
                        display: grid;

                        width: 300px;
                        margin: 0 auto;
                        margin-top: 5px;
                        grid-template-columns: 1fr 1.4fr;
                        grid-column-gap: 35px;

                        .speed {
                            background-color: transparent !important;
                            outline:none;
                            border: none;
                            color: #ffffff;
                            border: 0px !important;

                            font-size: 28px;
                            &:hover {
                                cursor: pointer;
                            }
                        }

                        @include button-style;

                        .skip-forward {
                            width:45px !important;
                            height: 45px !important;
                            padding: 0px;
                            margin-top: 5px;
                            background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='51' viewBox='0 0 59 51' width='59' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m28.6446 5.80873c-8.142.36006-15.5136 6.05037-17.7804 14.51047-2.78636 10.3986 3.1902 21.0272 13.3554 23.751 10.1653 2.7237 20.6554-3.4926 23.4417-13.8912' stroke='%23fff' stroke-miterlimit='10' stroke-width='2'/%3e%3cg fill='%23fff'%3e%3cpath d='m25.6403 9.33069 1.8255-3.46463-1.174-3.71364 8.0141 4.27556z'/%3e%3cpath d='m24.2843 25.408h.9502c.597-.0091 1.0664-.1663 1.4082-.4717.3418-.3053.5127-.7177.5127-1.2373 0-1.1666-.5811-1.75-1.7432-1.75-.5468 0-.9843.1573-1.3125.4717-.3235.3099-.4853.7223-.4853 1.2373h-1.2647c0-.7884.2871-1.4424.8614-1.9619.5787-.5241 1.3125-.7861 2.2011-.7861.9388 0 1.6748.2483 2.208.7451.5332.4967.7998 1.1872.7998 2.0713 0 .4329-.1412.8522-.4238 1.2578-.278.4056-.6585.7087-1.1416.9092.5469.1731.9684.4603 1.2647.8613.3007.401.4511.891.4511 1.4697 0 .8933-.2916 1.6019-.875 2.126-.5833.5241-1.3421.7861-2.2763.7861-.9343 0-1.6953-.2529-2.2832-.7588-.5834-.5058-.875-1.1735-.875-2.0029h1.2714c0 .5241.1709.9434.5127 1.2578.3418.3145.7998.4717 1.3741.4717.6106 0 1.0778-.1595 1.4013-.4785.3236-.319.4854-.777.4854-1.374 0-.5788-.1777-1.0231-.5332-1.333s-.8682-.4694-1.5381-.4786h-.9502zm12.2637 1.3467c0 1.4811-.253 2.5817-.7588 3.3018-.5059.72-1.2966 1.08-2.3721 1.08-1.0618 0-1.848-.3509-2.3584-1.0527-.5104-.7064-.7747-1.7591-.793-3.1582v-1.6885c0-1.4629.253-2.5498.7588-3.2607.5059-.711 1.2989-1.0664 2.3789-1.0664 1.071 0 1.8594.344 2.3653 1.0322.5058.6836.7656 1.7409.7793 3.1719zm-1.2647-1.7295c0-1.071-.1504-1.8503-.4511-2.3379-.3008-.4922-.7771-.7383-1.4288-.7383-.6471 0-1.1188.2439-1.415.7315s-.4489 1.2373-.458 2.249v2.0234c0 1.0756.1549 1.8708.4648 2.3858.3145.5104.7885.7656 1.4219.7656.6244 0 1.0869-.2415 1.3877-.7246.3053-.4831.4649-1.2441.4785-2.2832z'/%3e%3c/g%3e%3c/svg%3e") no-repeat;
                        }
                        .skip-back {
                            width:45px !important;
                            height: 45px !important;
                            margin-top: 5px;
                            margin-left: 10px;
                            padding: 0px;
                            background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='51' viewBox='0 0 58 51' width='58' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m29.5918 5.80867c8.1421.36006 15.5136 6.05033 17.7805 14.51043 2.7863 10.3987-3.1903 21.0272-13.3555 23.751s-20.6554-3.4925-23.4417-13.8912' stroke='%23fff' stroke-miterlimit='10' stroke-width='2'/%3e%3cg fill='%23fff'%3e%3cpath d='m32.5962 9.33063-1.8256-3.46463 1.1741-3.71364-8.0141 4.27556z'/%3e%3cpath d='m23.2842 25.4082h.9502c.597-.0091 1.0664-.1663 1.4082-.4717.3418-.3053.5127-.7177.5127-1.2373 0-1.1666-.5811-1.75-1.7432-1.75-.5469 0-.9844.1572-1.3125.4717-.3236.3099-.4853.7223-.4853 1.2373h-1.2647c0-.7884.2871-1.4424.8613-1.9619.5788-.5241 1.3125-.7861 2.2012-.7861.9388 0 1.6748.2483 2.208.7451.5332.4967.7998 1.1871.7998 2.0713 0 .4329-.1413.8522-.4238 1.2578-.278.4056-.6585.7086-1.1416.9092.5469.1731.9684.4602 1.2646.8613.3008.401.4512.8909.4512 1.4697 0 .8932-.2917 1.6019-.875 2.126s-1.3421.7861-2.2764.7861c-.9342 0-1.6953-.2529-2.2832-.7588-.5833-.5058-.875-1.1735-.875-2.0029h1.2715c0 .5241.1709.9434.5127 1.2578.3418.3145.7998.4717 1.374.4717.6107 0 1.0778-.1595 1.4014-.4785s.4854-.777.4854-1.374c0-.5788-.1778-1.0232-.5332-1.3331-.3555-.3099-.8682-.4694-1.5381-.4785h-.9502zm12.2637 1.3467c0 1.4811-.253 2.5817-.7588 3.3017-.5059.7201-1.2966 1.0801-2.3721 1.0801-1.0619 0-1.848-.3509-2.3584-1.0527-.5104-.7064-.7747-1.7591-.793-3.1582v-1.6885c0-1.4629.253-2.5498.7588-3.2607.5059-.711 1.2988-1.0664 2.3789-1.0664 1.071 0 1.8594.344 2.3653 1.0322.5058.6836.7656 1.7409.7793 3.1719zm-1.2647-1.7295c0-1.071-.1504-1.8503-.4512-2.3379-.3008-.4922-.777-.7383-1.4287-.7383-.6471 0-1.1188.2438-1.415.7315-.2962.4876-.4489 1.2373-.458 2.249v2.0234c0 1.0755.1549 1.8708.4648 2.3858.3145.5104.7884.7656 1.4219.7656.6243 0 1.0869-.2415 1.3877-.7246.3053-.4831.4648-1.2442.4785-2.2832z'/%3e%3c/g%3e%3c/svg%3e") no-repeat;
                        }
                    }
                }


            img {
                width: 100%;
                height: auto;
            }

            .text {
                margin-top: 20px;

                p {

                }
            }

            .now-playing {
                font-size: 14px;
                /*visibility: hidden;*/
                text-align: center;
                margin: 0 auto;
                margin-bottom: 5px;
                transition: all 0s linear 300ms, opacity 300ms;
            }
        }
    }

    .standalone-button {
      background-size: 23px !important;
      min-height: 25px;
      transition: opacity 0.2s ease-in-out;
      &:hover {
          cursor: pointer;
          opacity: 0.6 !important;
      }
      background-position: left;
      padding-left: 30px;

      background: transparent url("data:image/svg+xml;charset=UTF-8,%3csvg fill='none' height='40' viewBox='0 0 40 40' width='40' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m32 19.5-18.75 10.8253v-21.65062z' fill='%23000'/%3e%3ccircle cx='20' cy='20' r='19' stroke='%23000' stroke-width='2'/%3e%3c/svg%3e") no-repeat;
      margin-right: 6px;
    }


    .fade-enter-active, .fade-leave-active {
        transition: all 1.5s ease-out;
        max-height: 1000px;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
        max-height: 0px;
    }

    div.playlist {
      color: #000;

      ul {
      list-style: none;
      text-indent: 0px;
      margin: 0px;
      padding: 0px;
      max-width: 600px;
      margin: 0 auto;

      text-align: left;
      li {
          button {
            border: 0px;
            border-radius: 0px;
            color: #000;
            font-size: 14px;
            text-align: left;


            &:active {
              color: pink;
            }
          }

          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid #000;
      }
    }
    }

    @-webkit-keyframes rotation {
        from {
            -webkit-transform: rotate(0deg);
        }
        to {
            -webkit-transform: rotate(359deg);
        }
    }
</style>
