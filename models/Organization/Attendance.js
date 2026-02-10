const mongoose = require('mongoose')

const Attendance_Schema = new mongoose.Schema({
    User_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    Org_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organization"
    },
    Device_Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Devices"
    },
    Name:{
        type:String,
        required:true
    },
    EMP_Code:{
        type:String
    },
    DateString:{
        type:String,
        default:'DD/MM/YYYY'
    },
    IN_Time:{
        type:String,
        default:'00:00 AM'
    },
    OUT_Time:{
        type:String,
        default:'00:00 PM'
    },
    Work_Time:{
        type:String,
        default:'00:00'
    },
    Break_Time:{
        type:String
    },
    Remark:{
        type:String
    },
    Over_Time:{
        type:String,
        default:'00:00'
    },
    Erl_Out:{
        type:String,
        default:'00:00'
    },
    Late_In:{
        type:String,
        default:'00:00'
    },
    status:{
        type:String,
        enum:["P","A","L","WO","HL"],
        default:"A"
    }
},{timestamps:true})

module.exports = mongoose.model("Attendance",Attendance_Schema)