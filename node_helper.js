/* Magic Mirror
 * Node Helper: Newsfeed
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var counter = 0;

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		console.log("Starting module: " + this.name);
		setInterval(() => {
			this.sendSocketNotification("TEST", "NODE HELPER: " + counter++);
		}, 100)
	},

	// Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "CONFIG") {

		}
	},
});
