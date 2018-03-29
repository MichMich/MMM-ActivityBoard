<template>
	<div class="kids-interface">
		<div class="image-holder" :style="{'background-image': 'url(' + image + ')'}" @click="friendIndex = (friendIndex + 1) % friends.length"></div>
		<div class="name">{{friend.name}}</div>
		<div class="actions">
			<div class="action call" :class="{'is-active': buttons.ARCADE_1}" @click.prevent="toggle('ARCADE_1')">
				<img src="../assets/enzo-images/call.svg" alt="">
			</div>
			<div class="action message" :class="{'is-active': buttons.ARCADE_2}" @click.prevent="toggle('ARCADE_2')">
				<img src="../assets/enzo-images/message.svg" alt="">
			</div>
			<div class="action video" :class="{'is-active': buttons.ARCADE_3}" @click.prevent="toggle('ARCADE_3')">
				<img src="../assets/enzo-images/video.svg" alt="">
			</div>
		</div>
	</div>
</template>
<script>
import SoundPlayer from '../mixins/SoundPlayer'

export default {
	mixins: [SoundPlayer],
	data () {
		return {
			buttons: {},
			friendIndex: 0,
			friends: [
				{
					name: 'Buurman & Buurman',
					avatar: 'buurmanbuurman.jpg',
					sounds: {
						ARCADE_1: {file: 'enzo-sounds/ajetoo.wav'},
						ARCADE_2: {file: 'enzo-sounds/buurman.wav'},
						ARCADE_3: {file: 'enzo-sounds/he.wav'}
					}
				},
				{
					name: 'Cars',
					avatar: 'cars.jpg',
					sounds: {
						ARCADE_1: {file: 'enzo-sounds/cars1.wav'},
						ARCADE_2: {file: 'enzo-sounds/cars2.wav'},
						ARCADE_3: {file: 'enzo-sounds/cars3.wav'}
					}
				},
				{
					name: 'Dinotrux',
					avatar: 'dinotrux.jpg',
					sounds: {
						ARCADE_1: {file: 'enzo-sounds/dinotrux1.wav'},
						ARCADE_2: {file: 'enzo-sounds/dinotrux2.wav'},
						ARCADE_3: {file: 'enzo-sounds/dinotrux3.wav'}
					}
				},
				{
					name: 'Fien & Teun',
					avatar: 'fienteun.jpg',
					sounds: {
						ARCADE_1: {file: 'enzo-sounds/fienteun1.wav'},
						ARCADE_2: {file: 'enzo-sounds/fienteun2.wav'},
						ARCADE_3: {file: 'enzo-sounds/fienteun3.wav'}
					}
				},
				{
					name: 'Pieter Konijn',
					avatar: 'konijn.jpg',
					sounds: {
						ARCADE_1: {file: 'enzo-sounds/konijn1.wav'},
						ARCADE_2: {file: 'enzo-sounds/konijn2.wav'},
						ARCADE_3: {file: 'enzo-sounds/konijn3.wav'}
					}
				},
				{
					name: 'Brandweerman Sam',
					avatar: 'sam.jpg',
					sounds: {
						ARCADE_1: {file: 'enzo-sounds/sam1.wav'},
						ARCADE_2: {file: 'enzo-sounds/sam2.wav'},
						ARCADE_3: {file: 'enzo-sounds/sam3.wav'}
					}
				},
				{
					name: 'Kleine Rode Traktor',
					avatar: 'traktor.jpg',
					sounds: {
						ARCADE_1: {file: 'enzo-sounds/traktor1.wav'},
						ARCADE_2: {file: 'enzo-sounds/traktor2.wav'},
						ARCADE_3: {file: 'enzo-sounds/traktor3.wav'}
					}
				}
			]
		}
	},
	computed: {
		friend () {
			return this.friends[this.friendIndex]
		},
		image () {
			return require('../assets/enzo-images/' + this.friend.avatar)
		}
	},
	methods: {
		toggle (identifier) {
			var buttons = Object.assign({}, this.buttons)
			buttons[identifier] = !buttons[identifier]
			this.buttons = buttons
		}
	},
	mounted () {
		this.$parent.$off()
		this.sounds = this.friend.sounds
		this.$parent.$on('buttons', payload => {
			this.buttons = payload
		})
		this.$parent.$on('button_changed', payload => {
			if (payload.name === 'ROTARY_A' && payload.state) {
				if (this.buttons.ROTARY_B) {
					this.friendIndex = (this.friendIndex + 1) % this.friends.length
				} else {
					this.friendIndex = this.friendIndex > 0 ? this.friendIndex - 1 : this.friends.length - 1
				}
			}

			if (payload.state) {
				this.stopSound(payload.name)
				this.playSound(payload.name)
			} else {
				if (this.sounds[payload.name] && this.sounds[payload.name].loop) {
					this.stopSound(payload.name)
				}
			}
		})
	},
	watch: {
		buttons: {
			handler (to, from) {
				this.$emit('buttons', this.buttons)
			},
			deep: true
		},
		friendIndex (to, from) {
			this.sounds = this.friend.sounds
		}
	}
}
</script>
<style lang="scss">
	#app {
		background-image: url('../assets/enzo-images/bg.jpg');
		background-size: cover;
	}
	.kids-interface {
		text-align: center;
	}
	.image-holder {
		border: 4px solid white;
		background-size: cover;
		background-position: center center;
		background-repeat: no-repeat;
		border-radius: 1000px;
		margin: 20px;
		margin-top: 50px;
		box-shadow: 0px 5px 3px 2px rgba(0, 0, 0, 0.5);
	}
	.image-holder:after {
		content: "";
		display: block;
		padding-bottom: 100%;
	}
	.name {
		margin-top: 60px;
		font-size: 40px;
		color: white;
		font-weight: bold;
		text-shadow: 0px 5px rgba(0, 0, 0, 0.5);
	}
	.actions {
		margin: 60px 20px;
		display:flex;
		justify-content: space-around;
		.action {
			width: 100px;
			height: 100px;
			background-color: rgba(50,50,50,0.5);
			box-shadow: 0px 5px 3px 2px rgba(0, 0, 0, 0.5);
			border-radius: 100px;
			img {
				width: 50px;
				height: 50px;
				margin: 25px;
				filter: invert(0.8);
			}
		}
		.is-active {
			img {
				filter: invert(0);
			}
		}
		.is-active.call {
			background-color: #00B4FF;
		}
		.is-active.message {
			background-color: #BEF202;
		}
		.is-active.video {
			background-color: #F03C02;
		}
	}
</style>
