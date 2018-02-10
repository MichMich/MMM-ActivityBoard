/* Magic Mirror
 * Node Helper: Newsfeed
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */
var express = require("express");
var NodeHelper = require("node_helper");
// var SerialPort = require("serialport");
// var Readline = SerialPort.parsers.Readline;

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
		console.log("From: " + "/static/media")
		console.log("To: " + this.path + "/vue-app/static/media")
		this.expressApp.use("/static/media", express.static(this.path + "/vue-app/dist/static/media"));
	},

	openSerialPort: function() {
		console.log("Open serial port: " + this.config.port + ", Baud rate: " + this.config.baudRate)
		// this.port = SerialPort(this.config.port, {
		// 	baudRate: this.config.baudRate
		// })

		// this.port.on('open', () => {
		// 	this.port.write('main screen turn on', function(err) {
    	// 			if (err) {
      	// 				return console.log('Error on write: ', err.message);
    	// 			}
    	// 			console.log('message written');
  		// 	});
		// });

		// const parser = this.port.pipe(new Readline());
		// parser.on("data", (data) => {
		// 	var message;

		// 	try {
		// 		message = JSON.parse(data);		
		// 	} catch (e) {
		// 		console.log("Unusable data from dataBuffer: " + data);
		// 	};

		// 	this.handleMessage(message);
		// });

	},

	handleMessage: function(message) {
		if (!message || typeof message !== 'object') return;

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
