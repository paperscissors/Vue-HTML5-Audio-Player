import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// check if this is a script embed and there's no container
let player_container = document.getElementById('vue_audio_player');
let script_tag = document.getElementById('embedded_player');
if (!player_container && script_tag) {
  let player_container = document.createElement('div');
  player_container.setAttribute('id', 'vue_audio_player');
  script_tag.before(player_container);
}

new Vue({
  render: h => h(App),
  data: {
		playlist: []
	}
}).$mount('#vue_audio_player')
