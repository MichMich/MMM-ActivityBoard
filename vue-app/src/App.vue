<template>
	<div id="app">
		<test-interface @buttons="onButtons" v-if="activeInterface == 1"></test-interface>
		<kids-interface @buttons="onButtons" v-if="activeInterface == 2"></kids-interface>
		<interface-selector v-if="showInterfaceSelector" v-model="activeInterface" :interfaces="interfaces"></interface-selector>
		<!-- <a @click="activeInterface = (activeInterface == 0) ? 1 : 0">switch</a> -->
	</div>
</template>
<script>
import InterfaceSelector from './components/InterfaceSelector'
import TestInterface from './components/TestInterface'
import KidsInterface from './components/KidsInterface'

export default {
	name: 'App',
	components: {
		InterfaceSelector,
		TestInterface,
		KidsInterface
	},
	data () {
		return {
			buttons: {},
			showInterfaceSelector: false,
			activeInterface: 1,
			interfaces: [
				'System Disabled',
				'Debug Console',
				'Enzo\'s Interface'
			]
		}
	},
	methods: {
		onButtons (buttons) {
			this.buttons = buttons
		},
		checkSpecialCombinations () {
			if (this.buttons.ARCADE_1 && this.buttons.ARCADE_3 && this.buttons.ARCADE_3 && this.buttons.ROTARY_BUTTON) {
				this.showInterfaceSelector = !this.showInterfaceSelector
			}
		}
	},
	mounted () {
		this.$parent.$on('buttons', payload => {
			this.buttons = payload
			this.$emit('buttons', payload)
		})
		this.$parent.$on('slider', payload => {
			this.$emit('slider', payload)
		})
		this.$parent.$on('auto_off', payload => {
			this.$emit('auto_off', payload)
		})
	},
	watch: {
		buttons: {
			handler (to, from) {
				this.$emit('buttons', to)
				Object.keys(to).forEach(key => {
					if (to[key] !== from[key]) {
						console.log({name: key, state: to[key]})
						this.$emit('button_changed', {name: key, state: to[key]})
						this.checkSpecialCombinations()
					}
				})
			},
			deep: true
		},
		activeInterface (to, from) {
			this.showInterfaceSelector = false
		}
	}
}
</script>

<style lang="scss">
#app {
	background-color: #111;
	width: 460px;
	height: 780px;
	padding: 10px;
	font-size: 20px;
	position: relative;
}
</style>
