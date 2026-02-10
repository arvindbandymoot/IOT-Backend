const mongoose = require('mongoose')

const Organization_Schema = new mongoose.Schema({
    org_name:{
        type:String,
        required:true
    },
    org_email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    license_key:{
        type:String,
        default:"x2j9ujdjkwqn$ug#cgf@cvy&ib*hiu19i!uhduh73yt9hiuhb",
        required:true
    },
    total_devices:{
        type:Number,
        default:0
    },
    total_users:{
        type:Number,
        default:0
    },
    role:{
        type:String,
        default:"Organization"
    },
    subscription:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subscription"
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

module.exports = mongoose.model("Organization",Organization_Schema)