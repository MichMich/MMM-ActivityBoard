const SoundPlayer = {
	data () {
		return {
			sounds: []
		}
	},
	methods: {
		playSound (identifier) {
			if (!this.sounds[identifier]) return

			var sound = this.sounds[identifier]

			console.log('Play sound: ' + sound.file)

			var player
			if (sound.loop) {
				if (sound.player) {
					player = sound.player
				} else {
					player = new Audio(require('../assets/' + sound.file))
					player.loop = true
					sound.player = player
				}
			} else {
				player = new Audio(require('../assets/' + sound.file))
			}

			player.currentTime = 0
			player.play()
		},
		stopSound (identifier) {
			if (!this.sounds[identifier]) return

			var sound = this.sounds[identifier]

			if (sound.player) sound.player.pause()
		}
	}
}

export default SoundPlayer
