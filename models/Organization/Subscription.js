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
    amount:{
        type:Number,
        required:true,
    },
    startDate:{
        type:Date,
    },
    endDate:{
        type:Date,
    },
    status:{
        type:String,
        enum:["ACTIVE","EXPIRED"],
        default:"EXPIRED"
    }
},{timestamps:true})

module.exports = mongoose.model("Subscription",SubscriptionSchema)