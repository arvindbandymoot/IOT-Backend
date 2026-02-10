const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Oraganization = require('../../../models/Organization/Organization')
const Manager  = require('../../../models/Organization/Manager')


//Create Manager.
exports.Create_Manager = async(req ,res)=>{
    try {
        const user = req.user
        const {manager_name,manager_email,manager_password} = req.body

        // Check All Field Are Required.
        if(!manager_email||!manager_name||!manager_password){
            return res.status(400).json({success:false,message:"All Field Are Required"})
        }

        // Now Check That This Mail Alreday Exist Or Not.
        const IsExist_Mail = await Manager.findOne({manager_email})
        if(IsExist_Mail){
            return res.status(409).json({success:false,message:"Email Already Exist"})
        }

        // Now Hash The Password.
        const hashPassword = await bcrypt.hash(manager_password,10)
        const newManager = new Manager({
            manager_name,manager_email,manager_password:hashPassword,org_id:user._id
        })

        await newManager.save()
        res.status(201).json({success:true,message:`Manager '${manager_name}' Created SuccessFully`})
    } catch (error) {
        console.log("Internal Server Error:",error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

//Login Manager.
exports.Login_Manager = async(req ,res)=>{
    try {
        const {manager_email,manager_password}= req.body

        //Check All Field Are Required.
        if(!manager_email||!manager_password){
            return res.status(400).json({success:false,message:"All Field Are Required"})
        }
         
        // Now Check The Mail Are Exist In Db Or NOt.
        const manager = await Manager.findOne({manager_email})
        if(!manager){
            return res.status(400).json({success:false,message:"User Does Exist"})
        }

        // Now Compare The Password.
        const IsCorrect_Password = await bcrypt.compare(manager_password,manager.manager_password)
        if(!IsCorrect_Password){
            return res.status(400).json({success:false,message:"Password Does Not Match"})
        }

        // Now Genrate The Jwt Token.
        const payload = {userId:manager._id,email:manager.manager_email}
        const token = jwt.sign(payload,process.env.JWT_SECREATE,{expiresIn:'24h'})

        res.status(200).json({success:true,message:"Login SuccessFully",data:token})
    } catch (error) {
        console.log("Internal Server Error:",error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

//GET Manager Details
exports.Manager_Details = async(req,res)=>{
    try {
        const user = req.user
        const manager = await Manager.findById(user._id)
        if(!manager){
            return res.status(400).json({success:false,message:"Manager Details Does Not Exist"})
        }

        res.status(200).json({success:true,message:"Manager Details Fetch ",data:manager})
    } catch (error) {
        console.log("Internal Server Error:",error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}