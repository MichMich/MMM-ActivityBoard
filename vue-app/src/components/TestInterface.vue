<template>
	<div class="rows">
		<div class="row header">
			E.N.Z.O.
		</div>
		<div class="row button-indicators">
			<div class=" is-red" @click="toggle('MAIN_SW_1')" :class="{'is-active': buttons.MAIN_SW_1}">M1</div>
			<div class=" is-red" @click="toggle('MAIN_SW_2')" :class="{'is-active': buttons.MAIN_SW_2}">M2</div>
		</div>
		<div class="row button-indicators">
			<div class=" is-yellow" @click="toggle('TRIPLE_SW_1')" :class="{'is-active': buttons.TRIPLE_SW_1}">T1</div>
			<div class=" is-yellow" @click="toggle('TRIPLE_SW_2')" :class="{'is-active': buttons.TRIPLE_SW_2}">T2</div>
			<div class=" is-yellow" @click="toggle('TRIPLE_SW_3')" :class="{'is-active': buttons.TRIPLE_SW_3}">T3</div>
		</div>
		<div class="row button-indicators">
			<div class=" is-purple" @click="toggle('ARCADE_1')" :class="{'is-active': buttons.ARCADE_1}">A1</div>
			<div class=" is-purple" @click="toggle('ARCADE_2')" :class="{'is-active': buttons.ARCADE_2}">A2</div>
			<div class=" is-purple" @click="toggle('ARCADE_3')" :class="{'is-active': buttons.ARCADE_3}">A3</div>
		</div>
		<div class="row button-indicators">
			<div class=" is-green" @click="toggle('ROCKER_GR_1')" :class="{'is-active': buttons.ROCKER_GR_1}">GR1</div>
			<div class=" is-green" @click="toggle('ROCKER_GR_2')" :class="{'is-active': buttons.ROCKER_GR_2}">GR2</div>
		</div>
		<div class="row button-indicators">
			<div class=" is-red" @click="toggle('ROCKER_RD_1')" :class="{'is-active': buttons.ROCKER_RD_1}">RR1</div>
			<div class=" is-red" @click="toggle('ROCKER_RD_2')" :class="{'is-active': buttons.ROCKER_RD_2}">RR2</div>
		</div>
		<div class="row button-indicators">
			<div class=" is-purple" @click="toggle('ROTARY_A')" :class="{'is-active': buttons.ROTARY_A}">A</div>
			<div class=" is-purple" @click="toggle('ROTARY_BUTTON')" :class="{'is-active': buttons.ROTARY_BUTTON}">ROTARY BUTTON</div>
			<div class=" is-purple" @click="toggle('ROTARY_B')" :class="{'is-active': buttons.ROTARY_B}">B</div>
		</div>
		<div class="row console">
			<div class="content">
				<div v-for="(log, key) in logs" :key="key">
					<div>
						<span class="timestamp">{{log.timestamp.valueOf()}}: </span>
						<span class="message">{{log.message}}</span>
					</div>
					<div class="payload">{{log.payload}}</div>
				</div>
			</div>
		</div>
		<div class="row slider">
			<div class="indicator-wrapper">
				<div class="indicator" :style="{left: slider/1024*100 + '%'}"></div>
			</div>
		</div>
		<div class="row footer">
			E.N.Z.O. - &copy; 2018
		</div>
	</div>
</template>

<script>
// import HelloWorld from './components/HelloWorld'
import SoundPlayer from '../mixins/SoundPlayer'

export default {
	name: 'App',
	mixins: [SoundPlayer],
	components: {
		// HelloWorld
	},
	data () {
		return {
			buttons: {},
			slider: 0,
			logs: [],
			sounds: {
				'MAIN_SW_1': {
					file: 'test-sounds/beep.wav',
					loop: true
				},
				'MAIN_SW_2': {
					file: 'test-sounds/radioscatter.wav',
					loop: true
				},
				'ARCADE_1': {
					file: 'test-sounds/teleport.wav'
				},
				'ARCADE_2': {
					file: 'test-sounds/laser.wav'
				},
				'ARCADE_3': {
					file: 'test-sounds/menu1.wav'
				},
				'ROCKER_GR_1': {
					file: 'test-sounds/voice_scanning.wav'
				},
				'ROCKER_GR_2': {
					file: 'test-sounds/voice_vu.wav'
				},
				'ROCKER_RD_1': {
					file: 'test-sounds/connection.wav'
				},
				'ROCKER_RD_2': {
					file: 'test-sounds/upgrade.wav'
				},
				'TRIPLE_SW_1': {
					file: 'test-sounds/voice_color_adjusted.wav'
				},
				'TRIPLE_SW_2': {
					file: 'test-sounds/voice_plasma.wav'
				},
				'TRIPLE_SW_3': {
					file: 'test-sounds/voice_sparkle.wav'
				},
				'ROTARY_BUTTON': {
					file: 'test-sounds/runner.wav'
				}
			}
		}
	},
	methods: {
		addLog (message, payload) {
			this.logs.push({
				timestamp: new Date(),
				message: message,
				payload: payload
			})

			if (this.logs.length > 100) {
				this.logs = this.logs.slice(this.logs.length - 100)
			}
		},
		toggle (identifier) {
			var buttons = Object.assign({}, this.buttons)
			buttons[identifier] = !buttons[identifier]
			this.buttons = buttons
		},
		buttonChanged (identifier, state) {
			if (state) {
				this.playSound(identifier)
			} else {
				if (this.sounds[identifier] && this.sounds[identifier].loop) {
					this.stopSound(identifier)
				}
			}
		}
	},
	mounted () {
		this.$parent.$off()
		this.$parent.$on('buttons', payload => {
			this.buttons = payload
			this.addLog('buttons', payload)
		})
		this.$parent.$on('button_changed', payload => {
			this.buttonChanged(payload.name, payload.state)
		})
		this.$parent.$on('slider', payload => {
			this.slider = payload
			this.addLog('slider', payload)
		})
		this.$parent.$on('auto_off', payload => {
			this.addLog('auto_off', payload)
		})
	},
	watch: {
		buttons: {
			handler (to, from) {
				this.$emit('buttons', this.buttons)
			},
			deep: true
		}
	}
}
</script>

<style lang="scss">
.rows {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	.row {
		margin-bottom: 10px;
		&:last-child {
			margin-bottom: 0;
		}
	}
	.header {
		font-size: 24px;
		font-weight: bold;
		line-height: 60px;
		background-color: #333;
		border: 2px solid white;
		color: white;
		text-align: center;
	}
	.button-indicators {
		display: flex;
		div {
			border-bottom-right-radius: 10px;
			flex: 1;
			border: 2px solid #666;
			background-color: #000;
			color: #999;
			line-height: 60px;
			text-align: center;
			margin-right: 10px;
			//transition: background-color 0.25s, border-color 0.1s;
			&.is-active {
				border-color: #ffffff;
				background-color: #666666;
				color: white;
				&.is-red {
					border-color: #ff0000;
					background-color: #660000;
				}
				&.is-green {
					border-color: #00ff00;
					background-color: #006600;
				}
				&.is-yellow {
					border-color: #ffff00;
					background-color: #666600;
				}
				&.is-purple {
					border-color: #ff00ff;
					background-color: #660066;
				}
			}
			&:last-child {
				margin-right: 0;
			}
		}
		&:last-child {
			margin-bottom: 0;
		}
	}
	.slider {
		height: 30px;
		border: 2px solid #00ffff;
		background-color: #003333;
		padding-right: 30px;
		.indicator-wrapper {
			position: relative;
			.indicator {
				transition: left 0.25s;
				position: absolute;
				width: 30px;
				height: 30px;
				background-color: #00ffff;
			}
		}
	}
	.console {
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 13px;
		line-height: 13px;
		flex: 1;
		border: 2px solid #666;
		background-color: black;
		overflow: hidden;
		position: relative;
		.content {
			position: absolute;
			padding: 10px;
			width: 100%;
			bottom: 0;
			.timestamp {
				color: #666;
			}
			.message {
				color: #999;
			}
			.payload {
				color: #333;
				font-size: 10px;
			}
		}
	}
	.footer {
		font-size: 12px;
		line-height: 30px;
		background-color: black;
		border: 2px solid #333;
		text-align: center;
	}
}
</style>
