const Subscription = require('../../../models/Organization/Subscription')
const Oraganization = require('../../../models/Organization/Organization')

exports.CreateSubscription = async(req ,res)=>{
    try {
        const user = req.user
        const {plan,amount} = req.body
        console.log(req.body)
        if(!plan||!amount){
            return res.status(400).json({success:false,message:"Please Select Plan"})
        }
        //Check This Org Already Created Subscription Or Not.
        const subscription = await Subscription.findOne({OrgId:user._id})
        if(subscription){
            subscription.plan = plan
            subscription.amount = amount
            await subscription.save()
            return res.status(200).json({success:true,message:"Plan Are Update SuccessFully"})
        }
        const newPlan = await Subscription.create({
            OrgId:user._id,
            plan,
            amount
        })
        //Also Add Subscription Id Into Organization Table.
        const Org = await Oraganization.findById(user._id)
        Org.subscription = newPlan._id
        await Org.save()
        
        res.status(201).json({success:true,message:"Subscription Plan Are Created SuccessFully",data:newPlan})
    } catch (error) {
        console.log("Internal Server Error:",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}
exports.GetSubscription = async(req,res)=>{
    try {
        const user = req.user
        const subscriptionDetails = await Subscription.findOne({OrgId:user._id})
        if(!subscriptionDetails){
            return res.status(400).json({success:false,message:"Subscription Not Found In This User"})
        }
        res.status(200).json({success:true,message:"Fetch SuccessFully Subscription",data:subscriptionDetails})
    } catch (error) {
        console.log("Internal Server Error:",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}