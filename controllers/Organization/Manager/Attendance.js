const Oraganization = require('../../../models/Organization/Organization')
const Manager = require('../../../models/Organization/Manager')
const Devices = require('../../../models/Organization/Device')
const User = require('../../../models/Organization/User')
const Attendance =require('../../../models/Organization/Attendance')
exports.GetAttendance = async(req ,res)=>{
    try {
        const user = req.user
        const {empId,from,to}=req.params
        //Check The field Are Exist In Params Or NOt.
        if(!empId||!from||!to){
            return res.status(400).json({success:false,message:"All Field Are required In Params"})
        }

        // Find All Divice Id That Are Registerd By Manager.
        const DeviceIds = await Devices.find({device_manager_id:user._id}).select('_id')

        //Find All Attendance From To Date.
        const AttendanceList = empId==="All"?await Attendance.find({
            Device_Id:{$in:DeviceIds},
            DateString:{
                $gte:from,
                $lte:to
            }
        }):await Attendance.find({
           EMP_Code:empId,
           Device_Id:{
            $in:DeviceIds
           },
           DateString:{
            $gte:from,
            $lte:to
           }
        })

        res.status(200).json({success:true,message:"Fetch Attendance SuccessFully",data:AttendanceList})

    } catch (error) {
        console.log("Internal Server Error:",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}
exports.GetAttendanceByDevice = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log("Internal Server Error:",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}
exports.GetAttendanceByUser = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log("Internal Server Error:",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}