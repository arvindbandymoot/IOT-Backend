const mqttClient = require('../../config/mqtt')
const Devies = require('../../models/Organization/Device')
const { getIO, sendToUser } = require('../../socket/socket')

mqttClient.on("message", async (topic, message) => {
    try {
        //Check only status Topic allow endwith status word.
        if (!topic.endsWith('/status')) return

        //Extract message.
        const [secret, json] = message.toString().split('|')
        if (!json) return

        const data = JSON.parse(json)
        if (!data) return

         /* ===== Secret Validation ===== */

        const device = await Devies.findOne({ device_code: data.deviceId })
        if (!device) return;


        // Update DB status
        device.last_status = data.status;
        device.device_last_seen = new Date();
        await device.save();

        // Send only to that manager
        sendToUser(device.device_manager_id, "Device_Status", {
            deviceId: data.deviceId,
            status: data.status
        });

    } catch (error) {
        console.log("Mqtt Device Status Error:", error.message)
    }
})