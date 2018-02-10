/* global Module */

/* Magic Mirror
 * Module: HelloWorld
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("MMM-ActivityBoard",{

	// Default module config.
	defaults: {
		port: "/dev/ttyAMA0",
		baudRate: 115200
	},

	// Create a domObject on initialization.
	// This way we can re-use it whenever we run getDom.
	init: function () {
		this.domObject = document.createElement("div");
	},

	// Load all the vue app files.
	getScripts: function () {
		return [
			this.file("vue-app/dist/static/js/manifest.js"),
			this.file("vue-app/dist/static/js/vendor.js"),
			this.file("vue-app/dist/static/js/app.js")
		]
	},

	// Load all the vue css files.
	getStyles: function () {
		return [
			this.file("vue-app/dist/static/css/app.css")
		]
	},

	// Define the start procedure.
	start: function () {
		// Send the config to the backend.
		// This will establish a notification channel for the node helper.
		this.sendSocketNotification("CONFIG", this.config)

		// Add the Vue object to the dom object.
		this.domObject.appendChild(window.ActivityBoardVue.$el)
	},

	// Return the cached dom object.
	getDom: function () {
		return this.domObject;
	},

	// Forward the socket notification to the Vue app.
	socketNotificationReceived: function(notification, payload) {
		window.ActivityBoardVue.$emit(notification, payload)
		if (notification === "auto_off") {
			if (payload) {
				this.hide(1000)
			} else {
				this.show(1000)
			}
		}
	}
});
