/**
 * Copyright 2015 Endre Szabo
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
	var midi = require('midi');

    function MIDIin(n) {
        RED.nodes.createNode(this,n);
		this.id = parseInt(n.port);
        var node = this;
		var input = new midi.input();

        input.on('message', function (deltatime, arr) {
			if (arr.length!==3) {
				return null;
			}
			if ((arr[0] & 240) !== 176) {
				return null;
			}
			if (arr[1]>120) {
				return null;
			}
			var msg = { topic: arr[1], payload: arr[2], channel: (arr[0] & 15) + 1, deltatime: deltatime, port: this.id };
            node.send(msg);
        });
		try {
			input.openPort(this.id);
			node.log('MIDI port "'+input.getPortName(this.id)+'" opened.');
		} catch (err) {
			node.error(err);
		};

        node.on("close", function() {
            try {
                input.closePort();
                node.log('MIDI port closed.');
            } catch (err) {
                node.error(err);
            }
        });
    }

    RED.nodes.registerType("midi in", MIDIin);
}
