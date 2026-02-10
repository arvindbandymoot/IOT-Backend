// controller/mqtt/Enrollment_Handler.js
const mqttClient = require("../../config/mqtt");
const User = require("../../models/Organization/User");
const Devices = require('../../models/Organization/Device')
const Organization = require('../../models/Organization/Organization')
const {getIO} = require('../../socket/socket')

mqttClient.on("message", async (topic, message) => {
  try {
    if (!topic.endsWith("/enroll/result")) return;

    console.log("ENROLL RESULT:", topic, message.toString());

    const [secret, json] = message.toString().split("|");
    if (!json) {
      console.log("Invalid message format");
      return;
    }

    const data = JSON.parse(json);

    // Validate secret
    const expectedSecret = `SECURE_KEY_${data.deviceId}`;
    if (secret !== expectedSecret) {
      console.log("Invalid device secret");
      return;
    }

    if (data.result !== "SUCCESS") {
      console.log("Enrollment failed:", data.result);
      return;
    }

    // Find device
    const device = await Devices.findOne({ device_code: data.deviceId });
    if (!device) {
      console.log("Device not found:", data.deviceId);
      return;
    }

    // Update ONLY the matched device inside devices array
    const user = await User.findOneAndUpdate(
      {
        "devices.device": device._id,
        "devices.enrollment_status": "PENDING"
      },
      {
        $set: {
          "devices.$.enrollment_id": data.fingerId,
          "devices.$.enrollment_status": "ACTIVE",
          "devices.$.enrollment_at": new Date()
        }
      },
      { new: true }
    );

    if (!user) {
      console.log("No pending enrollment found for this device");
      return;
    }

    // Now Add User In Organization.
    const OrgDetails = await Organization.findById(device.org_id)
    OrgDetails.total_users = OrgDetails.total_users+1
    await OrgDetails.save()

    device.users_count = device.users_count+1
    await device.save()

    // Emit socket event (single emit, NOT inside on connection)
    getIO().emit("Enrollment_Status", {
      name: user.user_name,
      status: "Successfully Enrolled",
      device: data.deviceId
    });

    console.log(
      "✅ User enrolled:",
      user._id,
      "Device:",
      data.deviceId,
      "Finger:",
      data.fingerId
    );

  } catch (error) {
    console.error("MQTT ENROLL RESULT ERROR:", error);
  }
});
