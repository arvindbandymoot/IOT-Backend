const mongoose = require('mongoose')
const AdminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        default:"unknown"
    },
    email:{
        type:String,
        required:true,
        default:"example@gmail.com"
    },
    password:{
        type:String,
        required:true,
        default:"........"
    },
    role:{
        type:String,
        enum:["Admin"],
        default:"Admin"
    },
    status:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

module.exports = mongoose.model("Admin",AdminSchema)