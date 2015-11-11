# What is this repo?

In this repo you can find my contribution nodes (plugins) for the Internet-of-things wiring tool called [Node-RED](http://nodered.org/). With my extra nodes you can extend the available Node-RED interfaces.

They will probably contain some bugs as I am not a pro Node coder (and I am not a coder at all).

# Contents

### node-red-contrib-notification

This node uses Linux-specific dbus messaging bus to show up notifications to the currently signed in user running Node-RED in the background. This comes handy for personal assistant applications.

### node-red-contrib-joystick

This simple node allows you to receive joystick axis/button events on its two outputs.

### node-red-contrib-midi

This is a MIDI interface node that allows you to receive MIDI events.

### node-red-contrib-osc

This is an OSC (Open Sound Control) decoder/encoder node that you can use with embedded IoT thinks like Arduino and OSC compatible pro sound rig.

### node-red-contrib-slip

This implements the SLIP (Serial Line Internet Protocol) encapsulation/framing protocol that you can use to establish frames/packets on a raw stream IO like serial in/out nodes where there's no extra signalling to distinguish between packets.
