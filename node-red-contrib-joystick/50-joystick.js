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
	var joystick = require('joystick');

    function JOYSTICKin(n) {
        RED.nodes.createNode(this,n);
		this.id = n.id;
        var node = this;

		try {
			var js=new joystick(n.id,n.deadzone,n.sensitivity);
			node.log('Joystick opened');
		} catch (err) {
			node.error("Error opening joystick: "+err);
			return null;
		}
        js.on('button', function (message) {
			var msg = [null, { topic:message.number, payload:message.value, id:this.id }];
            node.send(msg);
        });
        js.on('axis', function (message) {
			var msg=[{ topic:message.number, payload:message.value, id:this.id }, null];
			node.send(msg);
		});

        node.on("close", function() {
            try {
				js.close();
                node.log('Joystick stopped');
            } catch (err) {
                node.error(err);
            }
        });
    }

    RED.nodes.registerType("joystick in", JOYSTICKin);
}
