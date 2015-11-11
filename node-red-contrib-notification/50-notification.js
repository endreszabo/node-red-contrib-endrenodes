module.exports = function(RED) {
	"use strict";
	var dbus = require('dbus-native');
	var sessionBus = dbus.sessionBus();
	
	function notificationInOutNode(n) {
		RED.nodes.createNode(this, n);
		this.appname = n.appname;
		this.timeout = n.timeout;
		this.imagepath = n.imagepath;
		this.closemsg = n.closemsg || 1;
		this.id = n.id || 0;

		var node = this;

		function handleInput(msg) {
			if (typeof(msg.payload) !== 'string') {
				msg.payload = JSON.stringify(msg.payload);
			}
			if (RED.settings.verbose) {
				node.log("inp: "+JSON.stringify({'hints':msg.hints || [], 'timeout': msg.timeout || parseInt(node.timeout)}));
			}
			node.notifications.Notify(
				msg.appname || node.appname, // app_name
				msg.id || 0,                 // id to replace
				msg.imagepath || '',         // app_icon
				msg.topic || 'Notification', // summary
				msg.payload || '',           // body
				msg.actions || [],           // actions
				msg.hints || [],             // hints
				msg.timeout*1000 ||
				parseInt(node.timeout)*1000, // expire_timeout
				function(err, id) {
					node.status({fill:"red",shape:"ring",text:"ERR: "+err});
					if (err) {
						node.send({
							'topic': 'error',
							'payload': err
						});
					} else {
						node.status({fill:"green",shape:"ring",text:"Notification shown"});
						node.send({
							'topic': 'notification',
							'payload': id
						});
					}
				}
			);
		}

		function register() {
			node.on("input", handleInput);
			sessionBus.getService('org.freedesktop.Notifications').getInterface('/org/freedesktop/Notifications', 'org.freedesktop.Notifications', function(err, notifications) {
				notifications.on('ActionInvoked', function(id, choice) {
					//Close active notification after the action (it may be not closed automatically)
					notifications.CloseNotification(id);
					node.status({fill:"green",shape:"dot",text:"Got action"});
					node.send({
						'topic': 'action',
						'payload': choice,
						'id': id
					});
				});
				notifications.on('NotificationClosed', function(id, reason) {
					if (node.closemsg) {
						node.send({
							'topic': 'closed',
							'payload': reason,
							'id': id
						});
					}
					node.status({fill:"green",shape:"dot",text:"Notification closed"});
				});
				node.notifications = notifications;
				node.status({fill:"green",shape:"dot",text:"init OK"});
			});
		};
		register();
	}

	RED.nodes.registerType("notification",notificationInOutNode);
}
