module.exports = function(RED) {
    "use strict";
	//var osc = require('osc');
	var osc=require('a2r-osc/lib/osc');

    function osc_encoder(n) {
        RED.nodes.createNode(this,n);
        var node = this;
		var make_bundle = n.bundle === "true";
		var make_base64 = n.base64 === "true";
		this.on('input', function(msg) {
			this.log(msg.payload);
			if (typeof msg.topic === 'undefined') {
				this.warn("OSC encoder: ignoring message with undefined topic");
				return null;
			};
			if (typeof msg.payload === 'undefined') {
				this.warn("OSC encoder: ignoring message with undefined payload, topic:"+msg.topic);
				msg.payload = new osc.Message(msg.topic);
			} else {
				if (typeof msg.typetag === 'undefined') {
					// smart mode
					if (!isNaN(msg.payload)) {
						msg.payload = new osc.Message(msg.topic, 'i', parseInt(msg.payload));
					} else {
						msg.payload = new osc.Message(msg.topic, msg.payload);
					};
					this.log("1");
				} else {
					msg.payload = new osc.Message(msg.topic, msg.typetag, msg.payload);
					this.log("2");
				};
			};
			if (make_bundle === true) {
				this.log("making bundle1 "+msg.payload.toString());
				msg.payload = new osc.Bundle(msg.payload);
				this.log("making bundle2 "+msg.payload.toString());
				this.warn(msg.payload.toBuffer().toString('base64'));
			};
			if (make_base64 === true) {
				this.log("sending as base64");
				this.send({payload:msg.payload.toBuffer().toString('base64')});
			} else {
				this.log("sending as buffer");
				this.send({payload:msg.payload.toBuffer()});
			}
		});
    };
    RED.nodes.registerType("osc encoder", osc_encoder);

    function osc_decoder(n) {
        RED.nodes.createNode(this,n);
		var simplify = n.simplify === "true";
        var node = this;
		
		this.on('input', function(msg) {
			//node.log("OSC decoder got input: "+msg.payload.toString());
			if (!typeof Buffer.isBuffer(msg.payload)) {
				node.error("Input payload is not a Buffer");
				return null;
			};
			var payload = osc.fromBuffer(msg.payload);
//			if (simplify) {
				if(1==1) {
				payload.elements.forEach(function(element){
					var m={}
					m.topic=element.address;
					if (element.arguments.length>1) {
						m.payload=element.arguments;
					} else {
						m.payload=element.arguments[0];
					};
					m.types=element.typeTag;
					node.send(m);
				});
			} else {
				this.send({payload:payload});
			}
		});
    }
    RED.nodes.registerType("osc decoder", osc_decoder);
}

