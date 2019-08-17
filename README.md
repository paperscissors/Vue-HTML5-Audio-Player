# Vue Audio Player
*This project is super pre-alpha stage. Do not put within one million miles of a production project.* A Vue.js based HTML5 audio player with an end goal to have a reliable tool that works across devices and covers a wide array of use cases, including podcasts and accessibility. Most open sourced players seem to completely overlook both podcast and accessibility features, so we're looking to fill in the gap.

Currently playlist, embeds, metadata, and podcast capabilities are being developed.

We are working on making this road-ready for use both in Vue.js as a component, and also as a standalone, embeddable javascript player.

## Installation
Clone this repo, run `npm install` or `yarn install`.

## Notes
I will be adding more in depth instructions soon.

####(Current embed attributes)
```
data-show-artwork="/fpo/image.jpg"
data-show-playlist="true"
data-show-speed="true"
data-show-skip="true"
data-width="600"
data-show-back="true"
data-show-next="true"
data-enable-metadata="false"
data-freeze-metadata="false"
data-playlist=''
data-default-metadata=''
```

####Roadmap
* Resolve playlist functionality
* Props vs. passed embed attribute graceful fallback
* Improve style portability and overrides
* More iOS fallbacks
* Research and implement different accessibility features
