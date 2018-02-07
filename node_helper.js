/* Magic Mirror
 * Node Helper: Newsfeed
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var SerialPort = require("serialport");

module.exports = NodeHelper.create({
	// Subclass start method.
	config: {},
	port: null,
	port: dataBuffer = null,
	buttons: {
		"ARCADE_1": 0,
		"ARCADE_2": 1,
		"ARCADE_3": 2,
		"ROCKER_GR_1": 3,
		"ROCKER_GR_2": 4,
		"ROCKER_RD_1": 5,
		"ROCKER_RD_2": 6,
		"ROTARY_A": 8,
		"ROTARY_B": 9,
		"MAIN_SW_1": 10,
		"MAIN_SW_2": 11,
		"ROTARY_BUTTON": 12,
		"TRIPLE_SW_3": 13,
		"TRIPLE_SW_2": 14,
		"TRIPLE_SW_1": 15,
	},

	start: function() {
		console.log("Starting module: " + this.name);
		// setInterval(() => {
		// 	this.handleMessage({"buttons": Math.floor((Math.random() * 65536))})
		// }, 500)

		// setInterval(() => {
		// 	this.handleMessage({"slider": Math.floor((Math.random() * 1024))})
		// }, 1734)

		// setInterval(() => {
		// 	this.handleMessage({"auto_off": Math.round(Math.random())})
		// }, 3000)

	},

	openSerialPort: function() {
		console.log("Open serial port: " + this.config.port + ", Baud rate: " + this.config.baudRate)
		this.port = SerialPort(this.config.port, {
			baudRate: this.config.baudRate
		})

		this.port.on("data", function (data) {
			this.dataBuffer += data
			var message = null

			try {
				message = JSON.parse(this.dataBuffer)
			} catch(e) {
				// not a full json string yet
			}

			if (message) {
				this.dataBuffer = null
				this.handleMessage(message)
			}
		});
	},

	handleMessage: function(message) {
		console.log(message)

		if (typeof message.buttons !== "undefined") {
			this.handleButtonChange(message.buttons)
		}

		if (typeof message.slider !== "undefined") {
			this.handleSliderChange(message.slider)
		}

		if (typeof message.auto_off !== "undefined") {
			this.sendSocketNotification("auto_off", message.auto_off === 1 ? true : false);
		}
	},

	sendCommand: function(command, payload = null) {
		this.sendSocketNotification(command, payload);
	},

	handleButtonChange: function(newState) {
		newButtonStates = {}
		Object.keys(this.buttons).forEach(buttonKey => {
			const buttonIndex = this.buttons[buttonKey]
			const buttonState = (newState >> buttonIndex) & 1;
			newButtonStates[buttonKey] = (buttonState == 1) ? false : true
		})
		this.sendSocketNotification("buttons", newButtonStates);
	},

	handleSliderChange: function(value) {
		this.sendSocketNotification("slider", value);
	},

	// Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "CONFIG") {
			this.config = payload
			this.openSerialPort()
		}
	},
});
