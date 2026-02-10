// controllers/mqtt/Attendance_Handler.js
const mqttClient = require('../../config/mqtt');
const Attendance = require("../../models/Organization/Attendance");
const User = require("../../models/Organization/User");
const Devices = require('../../models/Organization/Device');
const {getIO} = require('../../socket/socket')

const {utcToIST,calculateLateIn,calculateEarlyOut,calculateOverTime,calculateWorkTimeIST}=require('../../utils/DateFromate/GetEndDate')

mqttClient.on("message", async (topic, message) => {
  try {
    if (!topic.endsWith("/scan")) return;

    const [secret, json] = message.toString().split("|");
    if (!json) return;

    const data = JSON.parse(json);
    if (data.action !== "granted") return;

    //Validate secret
    const expectedSecret = `SECURE_KEY_${data.deviceId}`;
    if (secret !== expectedSecret) return;

    // Find device
    const device = await Devices.findOne({ device_code: data.deviceId });
    if (!device) return;

    // Find user by ACTIVE enrollment (embedded devices array)
    const user = await User.findOne({
      devices: {
        $elemMatch: {
          device: device._id,
          enrollment_id: data.fingerId,
          enrollment_status: "ACTIVE"
        }
      }
    });

    if (!user) {
      console.log("No active user found for this fingerprint");
      return;
    }

    const [dateOnly, timeOnly] = data.time.split(" ");

    // Find today's attendance (per user + device + date)
    let attendance = await Attendance.findOne({
      User_Id: user._id,
      Org_Id: user.org_Id,
      Device_Id: device._id,
      DateString: dateOnly
    });

    //FIRST SCAN → CHECK IN
    if (!attendance) {
      const IN_Time = utcToIST(timeOnly);
      const Late_In = calculateLateIn(IN_Time, process.env.SHIFT_IN);
     
      
      await Attendance.create({
        User_Id: user._id,
        Org_Id: user.org_Id,
        Device_Id: device._id,
        Name: user.user_name,
        EMP_Code: user.user_roll,
        DateString: dateOnly,
        IN_Time: IN_Time,
        OUT_Time: null,
        Late_In:Late_In,
        status: "P"
      });

      console.log(`IN: ${user.user_name} at ${timeOnly}`);

      getIO().emit("Attendance_Status", {
        name: user.user_name,
        status: "Check IN"
      });

      return;
    }

    //SECOND SCAN → CHECK OUT
    if (attendance.IN_Time && !attendance.OUT_Time) {
      
      const OUT_Time = utcToIST(timeOnly);
  
      const Erl_Out = calculateEarlyOut(OUT_Time, process.env.SHIFT_OUT);
      const Over_Time = calculateOverTime(OUT_Time, process.env.SHIFT_OUT);
      const WorkTime = calculateWorkTimeIST(attendance.IN_Time,OUT_Time)
    
      attendance.OUT_Time = OUT_Time
      attendance.Work_Time = WorkTime
      attendance.Erl_Out = Erl_Out
      attendance.Over_Time = Over_Time
      await attendance.save();

      console.log(`OUT: ${user.user_name} at ${timeOnly}`);

      getIO().emit("Attendance_Status", {
        name: user.user_name,
        status: "Check OUT"
      });

      return;
    }

    //ALREADY COMPLETED
    console.log(`Attendance already completed for ${user.user_name}`);

  } catch (err) {
    console.error("Attendance MQTT Error:", err);
  }
});
