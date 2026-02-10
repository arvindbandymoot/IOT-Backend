const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://137.97.126.110:1883");

client.on("connect", () => {
  console.log("✅ MQTT Connected");
});

module.exports = client;