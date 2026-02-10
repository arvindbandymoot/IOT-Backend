const mongoose = require('mongoose')

const DeviceList_Schema = new mongoose.Schema({
    device_name:{
        type:String,
        required:true       
    },
    device_code:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model("DeviceList",DeviceList_Schema)