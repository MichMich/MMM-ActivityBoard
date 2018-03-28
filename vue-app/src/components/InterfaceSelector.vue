<template>
	<div class="interface-selector">
		<div class="popup">
			<div class="interface" v-for="(interfaceName, index) in interfaces" :key="index" :class="{'is-active': selectedValue==index}">
				{{interfaceName}}
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		value: {
			required: true
		},
		interfaces: {
			type: Array
		}
	},
	data () {
		return {
			buttons: {},
			selectedValue: this.value
		}
	},
	methods: {
		checkRotation () {
			if (this.buttons.ROTARY_B) {
				this.selectedValue = (this.selectedValue + 1) % this.interfaces.length
			} else {
				this.selectedValue = this.selectedValue > 0 ? this.selectedValue - 1 : this.interfaces.length - 1
			}
		}
	},
	mounted () {
		this.$parent.$on('buttons', payload => {
			this.buttons = payload
		})
		this.$parent.$on('button_changed', payload => {
			if (payload.name === 'ROTARY_A' && payload.state) {
				this.checkRotation()
			}
			if (payload.name === 'ROTARY_BUTTON' && payload.state) {
				this.$emit('input', this.selectedValue)
			}
		})
	}
}
</script>
<style lang="scss" scoped>
	.interface-selector {
		padding: 40px;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0,0,0,0.9);
		pointer-events: none;
		display:flex;
		flex-direction: column;
		justify-content:  center;
		.popup {
			border: 2px solid white;
			background-color: rgba(0,0,0,0.9);
			.interface {
				text-align: center;
				background-color: rgba(255,255,255,0.1);
				margin: 4px;
			}
			.is-active {
				color: black;
				background-color: white;
			}
		}
	}
</style>
