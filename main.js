/*
 * ioBroker Gotify Client Adapter v0.1.0
 *
 * (c) Michael Sauer <sauer.uetersen at gmail.com>, 2021
 */

/* jshint -W097 */
/* jshint strict: false */
/* jslint node: true */

/* eslint-disable no-var */
"use strict";

const utils = require("@iobroker/adapter-core");
const axios = require("axios");

const url = "https://push.zukunpht.de/message?token=A3Cg_qAAzKAQ_6.";
//let lastMessageTime = 0;
//let lastMessageText = "";

class Gotify extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: "gotify",
		});
		this.on("ready", this.onReady.bind(this));
		//this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));

		//this.on("message", obj => obj && obj.command === "send" && obj.message && this.processMessage(obj.message, obj));
		//this.on("message", this.processMessage(obj => obj && obj.message, obj));
		console.log("Pednis");
	}

	/**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	onMessage(obj) {
		console.log("Message processing!");
		if (typeof obj === "object" && obj.message) {
			if (obj.command === "send") {
				// e.g. send email or pushover or whatever
				this.log.info("send command");
				// Send response in callback if required
				//if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
			}
		}
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		this.log.info("config option gotify server: " + this.config.server);
		this.log.info("config option gotify token: " + this.config.token);

		var bodyFormData = {
			title: "Maeh",
			message: "Prima",
			priority: 1
		};

		axios({
			method: "post",
			headers: {
				"Content-Type": "application/json"
			},
			url: url,
			data: bodyFormData
		})
			.then(function(response) {
				console.log(response.data);
			})
			.catch(function(error) {
				if (!error.response) {
					console.log(error);
				} else {
					console.log(error.response.data);
				}
			});

		// examples for the checkPassword/checkGroup functions
		let result = await this.checkPasswordAsync("admin", "iobroker");
		this.log.info("check user admin pw iobroker: " + result);

		result = await this.checkGroupAsync("admin", "admin");
		this.log.info("check group user admin group admin: " + result);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);

			callback();
		} catch (e) {
			callback();
		}
	}
}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new Gotify(options);
} else {
	// otherwise start the instance directly
	new Gotify();
}