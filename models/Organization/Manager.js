const mongoose = require('mongoose')

const Manager_Schema = new mongoose.Schema({
    manager_name:{
        type:String,
        required:true
    },
    manager_email:{
        type:String,
        required:true
    },
    manager_password:{
        type:String,
        required:true
    },
    org_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organization"
    },
    last_login:{
        type:Date
    },
    role:{
        type:String,
        default:"Manager"
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

module.exports = mongoose.model('Manager',Manager_Schema)