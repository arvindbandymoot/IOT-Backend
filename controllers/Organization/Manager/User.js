const mqttClient = require("../../../config/mqtt");
const Manager = require('../../../models/Organization/Manager')
const Organization = require('../../../models/Organization/Organization')
const User = require('../../../models/Organization/User')
const Attendance = require('../../../models/Organization/Attendance')
const Devices = require('../../../models/Organization/Device')

//Enrollement User.
exports.Enroll_User = async (req, res) => {
    try {
        const manager = req.user;
        const { user_name, user_email, user_phone, user_department, user_roll, device_id } = req.body;

        if (!device_id || !user_email) {
            return res.status(400).json({
                success: false,
                message: "Device ID and User Email are required"
            });
        }

        //Find device
        const device = await Devices.findById(device_id);
        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }

        console.log("device code:", device.device_code);

        //Check if user already exists
        let user = await User.findOne({ user_email });

        let isExistingUser = true;

        //Create new user if not exists
        if (!user) {
            isExistingUser = false;

            user = await User.create({
                user_name,
                user_email,
                user_phone,
                user_department,
                user_roll,
                devices: [
                    {
                        device: device._id,
                        enrollment_status: "PENDING"
                    }
                ],
                org_Id: manager.org_id,
                manager_Id: manager._id,
                createdBy: manager.manager_name
            });
        }
        else {
            // Check if device already enrolled
            const deviceAlreadyExists = user.devices.some(
                d => d.device.toString() === device._id.toString()
            );

            if (deviceAlreadyExists) {
                return res.status(400).json({
                    success: false,
                    message: "This device is already enrolled for this user"
                });
            }

            //Push new device enrollment
            user.devices.push({
                device: device._id,
                enrollment_status: "PENDING"
            });

            await user.save();
        }

        //Send enroll command to device (MQTT)
        const topic = `device/${device.device_code}/enroll`;
        const payload = `SECURE_KEY_${device.device_code}|{}`;

        mqttClient.publish(topic, payload);
        console.log("Sending enroll command to:", topic);

        return res.status(200).json({
            success: true,
            message: isExistingUser
                ? "Place finger again on device"
                : "Place finger on device",
            userId: user._id
        });

    } catch (error) {
        console.error("Enroll_User Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
//Get User.
exports.GetUsers = async (req, res) => {
    try {
        const user = req.user
        const { deviceId = null } = req.query
        let AllUsers
        if (deviceId) {
            AllUsers = await User.find({ org_Id: user.org_id, 'devices.device': deviceId }).populate('devices.device').populate('org_Id').populate('manager_Id')
        }
        else {
            const deviceIds = await Devices.find({ device_manager_id: user._id }).select('_id')
            AllUsers = await User.find({
                org_Id: user.org_id,
                'devices.device': { $in: deviceIds }
            }).populate('devices.device').populate('org_Id').populate('manager_Id')

        }
        if (AllUsers.length == 0) {
            return res.status(200).json({ success: false, message: "Empty User" })
        }
        res.status(200).json({ success: true, message: "Fetch User SuccessFully", data: AllUsers })
    } catch (error) {
        console.log("Internal Server Error:", error.message)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
//Update User
exports.UpdateUser = async (req, res) => {
    try {
        const user = req.user
        const { userId } = req.params
        const data = req.body

        //Check UserId Exist Or Not.
        if (!userId) {
            return res.status(400).json({ success: false, message: "Required UserId" })
        }
        const UserDetails = await User.findByIdAndUpdate(userId, {
            ...data,
            updatedBy: user.manager_name
        }, { new: true })

        if (!UserDetails) {
            return res.status(400).json({ success: false, message: "User does Not Exist" })
        }

        res.status(200).json({ success: true, message: "Update SuccessFully", data: UserDetails })

    } catch (error) {
        console.log("Internal Server Error:", error.message)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
//Delete User.
exports.Delete_User = async (req, res) => {
  try {
    const User = req.user
    const { userId } = req.params;
    const { deviceId } = req.query;

    if (!userId) {
      return res.status(400).json({success: false,message: "User Id is required"});
    }

    const user = await User.findById(userId).populate("devices.device");

    if (!user) {
      return res.status(404).json({success: false,message: "User not found"});
    }

    //Delete PARTICULAR device enrollment
    if (deviceId) {
      const deviceEntry = user.devices.find(
        d => d.device._id.toString() === deviceId.toString()
      );

      if (!deviceEntry) {
        return res.status(404).json({
          success: false,
          message: "Device not enrolled for this user"
        });
      }

      //Send delete command to device
      mqttClient.publish(
        `device/${deviceEntry.device.device_code}/delete`,
        `SECURE_KEY_${deviceEntry.device.device_code}|${deviceEntry.enrollment_id}`
      );

      //Remove device from user
      user.devices = user.devices.filter(
        d => d.device._id.toString() !== deviceId.toString()
      );
      if(user.devices.length()==0){
        user.status = "DEACTIVE"
      }

      await user.save();

      //Now Remove User Count From Organization.
      const OrgDetails = await Organization.findById(User.org_id)
      OrgDetails.total_users = OrgDetails.total_users-1
      await OrgDetails.save()

      const deviceDetails = await Devices.findById(deviceId)
      deviceDetails.users_count = deviceDetails.users_count-1
      await deviceDetails.save()

      return res.status(200).json({
        success: true,
        message: "Device enrollment deleted successfully"
      });
    }

    //Delete USER FROM ALL device
    for (const d of user.devices) {
      if (!d.enrollment_id) continue;

      mqttClient.publish(
        `device/${d.device.device_code}/delete`,
        `SECURE_KEY_${d.device.device_code}|${d.enrollment_id}`
      );
    }

    // Clear all devices
    user.devices = [];
    user.status="DEACTIVE"
    await user.save();

    return res.status(200).json({
      success: true,
      message: "All device enrollments deleted successfully"
    });

  } catch (error) {
    console.error("Delete_User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
//Delete All User.
exports.DeleteAll_User = async (req, res) => {
    try {
        const user = req.user
        const { deviceId } = req.params

        if (!deviceId) {
            return res.status(400).json({ success: false, message: "Device Id Missing" })
        }
        //Check Device Exist In Table Or Not.
        const Device_Details = await Devices.findById(deviceId)

        mqttClient.publish(
            `device/${Device_Details.device_code}/deleteAll`,
            `SECURE_KEY_${Device_Details.device_code}|{}`
        )

        res.status(200).json({ success: true, message: "Delete All SuccessFully" })
    } catch (error) {
        console.log("Internal Server Error:", error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
};
