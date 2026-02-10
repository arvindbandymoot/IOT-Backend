const mqttClient = require('../../config/mqtt')
const Organization =require('../../models/Organization/Organization')
const Manager = require('../../models/Organization/Manager')
const Devies = require('../../models/Organization/Device')

//const socket = require('../../config/socket')
const {getIO,sendToUser} = require('../../socket/socket')

mqttClient.on("message",async(topic,message)=>{
    try {
        //Check only status Topic allow endwith status word.
        if(!topic.endsWith('/status')) return

        //Extract message.
        const [secret,json] = message.toString().split('|')
        if(!json) return

        const data = JSON.parse(json)

        if(!data)return
        const device = await Devies.findOne({device_code:data.deviceId})

        /* ===== Secret Validation ===== */

        // getIO().on("connection",async(socket)=>{

        //     const managerId = socket.user._id

        //     const device = await Devies.findOne({device_code:data.deviceId,device_manager_id:managerId})
        //     if(!device)return
        //     console.log("DeviceId:",data.deviceId)  

        //     getIO().emit("Device_Status",{
        //     deviceId:data.deviceId,
        //     status:data.status
        //     })
        // })
        getIO().emit("Device_Status",
            {
                deviceId:data.deviceId,
                status:data.status
            }
        )
        // sendToUser(device.device_manager_id,"Device_Status",{
        //         deviceId:data.deviceId,
        //         status:data.status
        //     })
    } catch (error) {
        console.log("Mqtt Device Status Error:",error.message)
    }
})