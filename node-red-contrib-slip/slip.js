/**
 * Copyright 2014 Nicholas Humfrey
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    "use strict";
	var slip = require('slip');
	var Readable = require('stream').Readable;

    function slip_encoder(n) {
        RED.nodes.createNode(this,n);
        var node = this;
		var rs = new Readable;
		var encoder = new slip.SlipEncoder(512);
		//n.bufsize||512);
		
		encoder.on('data', function(data) {
			var msg = { payload: data };
			node.send(msg);
		});
		this.on('input', function(msg) {
			encoder.write(msg.payload);
		});

		//rs.pipe(encoder);
    }
    RED.nodes.registerType("slip encoder", slip_encoder);

    function slip_decoder(n) {
        RED.nodes.createNode(this,n);
        var node = this;
		var rs = new Readable;
		var decoder = new slip.SlipDecoder(512);
		console.log(decoder);
		
		decoder.on('data', function(data) {
			console.log("Got output raw:",data);
			//var msg = { payload: data.toString() };
			var msg = { payload: data };
			console.log("Got output",msg);
			node.send(msg);
		});
		this.on('input', function(msg) {
			console.log("Got input: "+msg.payload);
			decoder.write(msg.payload);
		});

		//rs.pipe(decoder);
    }
    RED.nodes.registerType("slip decoder", slip_decoder);
}

