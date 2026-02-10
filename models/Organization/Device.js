const mongoose = require('mongoose')

const Devices_Schema = new mongoose.Schema({
    device_name:{
        type:String,
        required:true
    },
    device_code:{
        type:String,
        required:true
    },
    secret_key:{
        type:String,
        required:true
    },
    users_count:{
        type:Number,
        default:0
    },
    device_location:{
        type:String,
        default:"Asia Kolkata"
    },
    device_last_seen:{
        type:Date,
    },
    device_firmware_version:{
        type:String,
        default:"1.0.0"
    },
    device_manager_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Manager"
    },
    org_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organization"
    },
    last_status:{
        type:String,
        default:"Offline"
    },
    createdBy:{
        type:String,
        default:null
    },
    updatedBy:{
        type:String,
        default:null
    }
},{timestamps:true})

module.exports = mongoose.model("Devices",Devices_Schema)