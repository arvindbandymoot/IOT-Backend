const Devices = require('../../../models/Organization/Device')
const Oraganization = require('../../../models/Organization/Organization')
const Attendance = require('../../../models/Organization/Attendance')

exports.Add_Device = async(req ,res)=>{
    try {
        const user = req.user
        const {device_name,device_code,secret_key}=req.body

        //Check All The field Are Required.
        if(!device_name||!device_code||!secret_key){
            return res.status(400).json({success:false,message:"All Field Are Required"})
        }
        // Now Check The Secret_Key Are Match Or Not.
        const orgDetails = await Oraganization.findById(user.org_id)
        if(!orgDetails){
            return res.status(400).json({success:false,message:"Org Does Not Exist."})
        }
        if(orgDetails.license_key != secret_key){
            return res.status(200).json({success:false,message:"Secret_Key Does Not Match"}) 
        }

        // Now Check The Device Already Ragister Or Not .
        const IsRegister = await Devices.exists({device_code})
        if(IsRegister){
            return res.status(400).json({success:false,message:`Device '${device_name+' '+ device_code}' Already Register`})
        }

        // Now Register The Device.
        const newDevice = new Devices({
            device_name,device_code,secret_key,
            device_manager_id:user._id,org_id:orgDetails._id,
            createdBy:user.manager_name
        })

        await newDevice.save()
        //Now Add Device In Organization.
        const OrgDetails = await Oraganization.findById(user.org_id)
        OrgDetails.total_devices = OrgDetails.total_devices+1
        await OrgDetails.save()
        res.status(201).json({success:true,message:`New Device ${device_name} Add SuccessFully In ${orgDetails.org_name}`})
    } catch (error) {
        console.log("Internal Server Error:",error)
        res.status(500).json({success:false,message:'Internal Server Error'})
    }
}
exports.Get_Device = async(req,res)=>{
    try {
        const user = req.user
        const DeviceList = await Devices.find({org_id:user.org_id,device_manager_id:user._id})

        //Check Id Device List Exist Or Not.
        if(!DeviceList){
            return res.status(400).json({success:false,message:"Device Does Not Exist"})
        }

        res.status(200).json({success:true,message:"Fetch Device SuccessFully",data:DeviceList})
    } catch (error) {
        console.log("Internal Server Error:",error,message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}
exports.Update_Device = async(req,res)=>{
    try {
        const user = req.user
        const {deviceId} = req.params
        const data = req.body
        
        //Check Device Id Exist Or Not.
        if(!deviceId){
            return res.status(400).json({success:false,message:"Device Id Does Not Exist"})
        }
        //Check User Enrolled In Device If Enrolled Then We Can Not Update device_Code and secret.
        if(data.device_code||data.secret_key){
            const IsUserExist = await Attendance.exists({Device_Id:deviceId})
            if(IsUserExist){
                return res.status(400).json({success:false,message:"Device_Code And Secret_Key Can Not Update"})
            }
        }
        const DeviceDetails = await Devices.findOneAndUpdate({_id:deviceId,org_id:user.org_id},{
            ...data,
            updatedBy:user.manager_name
        },{new:true})

        await DeviceDetails.save()

        res.status(200).json({success:true,message:"Device Update SuccessFully",data:DeviceDetails})
    } catch (error) {
        console.log("Internal Server Error:",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}
exports.Delete_Device = async(req,res)=>{
    try {
        const user = req.user
        const {deviceId} = req.params

        const deletedDevice = await Devices.findOneAndDelete({_id:deviceId,org_id:user.org_id,device_manager_id:user._id})
        if(!deletedDevice){
            return res.status(400).json({success:false,message:"Device Id Does Not Exist"})
        }
        const OrgDetails = await Oraganization.findById(user.org_id)
        OrgDetails.total_devices = OrgDetails.total_devices-1
        await OrgDetails.save()
        res.status(200).json({success:true,message:"Device Deleted SuccessFully."})
    } catch (error) {
        console.log("Internal Server Error:",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}
