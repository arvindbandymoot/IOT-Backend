const mongoose = require('mongoose')
const SubscriptionSchema = new mongoose.Schema({
    OrgId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organization"
    },
    plan:{
        type:String,
        enum:["Monthly","Yearly"],
        default:"Monthly"
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:["ACTIVE","EXPIRED"],
        default:"EXPIRED"
    }
},{timestamps:true})

module.exports = mongoose.model("Subscription",SubscriptionSchema)