const Organization = require('../../models/Organization/Organization')
const Devices = require('../../models/Organization/Device')


exports.GetOrganization = async(req ,res)=>{
    try {
        const user = req.user
        const organizationList = await Organization.find().populate('Subscription')
        if(!organizationList){
            return res.status(400).json({success:false,message:"Organization Does Not Exist"})
        }
        res.status(200).json({success:true,message:"Fetch Data Successfully",data:organizationList})
    } catch (error) {
        console.log("Internal Server Error:",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}
exports.UpadateStatus_Org = async(req,res)=>{
    try {
        const user = req.user
        const {orgId,status} = req.body
        if(!orgId||!status){
            return res.status(400).json({success:false,message:"All Field Are Required"})
        }
        //Now Find The Organization.
        const orgDetails = await Organization.findById(orgId)
        if(!orgDetails){
            return res.status(400).json({success:false,message:"Organization Does Not Exist"})
        }
        orgDetails.status = status?status:orgDetails.status
        await orgDetails.save()
        res.status(200).json({success:true,message:`Status:${orgDetails.status?'Activate':'Deactivate'} successFully`})
    } catch (error) {
        console,log("Internal Server Error:",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}
exports.GetOrg_Devices = async(req,res)=>{
    try {
        const user = req.user
        const {orgId} = req.body
        if(!orgId){
            return res.status(400).json({success:false,message:"Organization Id Are Required"})
        }
        const DevicesList = await Devices.find({org_id:orgId})
        if(!DevicesList){
            return res.status(400).json({success:false,message:"Device Does Not Exist"})
        }
        res.status(200).json({success:true,message:"Fetch Device List SuccessFully",data:DevicesList})
    } catch (error) {
        console.log("Internal Server Error:",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}