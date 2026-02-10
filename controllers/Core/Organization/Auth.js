const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Organization = require('../../../models/Organization/Organization')
const console = require('../../../utils/Settings/logger')

// Register Oraganization.
exports.Create_Organization = async(req ,res)=>{
    try {
        const {org_name,org_email,password,license_key} = req.body
        
        // Check The Field Are Missing Or Not.
        if(!org_name||!org_email||!password||!license_key){
            return res.status(400).json({success:false,message:"Field Are missing."})
        }

        // Check The Email Already Exist Or Not.
        const IsExist_Email = await Organization.findOne({org_email:org_email})
        if(IsExist_Email){
            return res.status(409).json({success:false,message:"This Email Already Exist."})
        }
        // Now Hash The Password.
        const hashpassword = await bcrypt.hash(password,10)

        // Now Create The Organization.
        const newOrg = new Organization({
            org_name,org_email,password:hashpassword,license_key
        })
        await newOrg.save()

        res.status(201).json({success:true,message:"Org Created SuccessFull",data:newOrg})

    } catch (error) {
        console.log("Internal Server Error",error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.Login_Organization = async(req,res)=>{
    try {
       const {org_email,password}= req.body

       // Check The Email And Password Are Required.
       if(!org_email||!password){
        return res.status(400).json({success:false,message:"All Field Are Required"})
       } 

       // Now Check The Mail Are Exist In Db Or Not.
       const IsExist_Org = await Organization.findOne({org_email})
       if(!IsExist_Org){return res.status(400).json({success:false,message:"This Mail Does Exist"})}

       // Now Compare The Password.
       const IsCorrect_Password = await bcrypt.compare(password,IsExist_Org.password)
       if(!IsCorrect_Password){
        return res.status(400).json({success:false,message:"Password Does not Match"})
       }

       // Now Create The JWT Token.
       const payload = {userId:IsExist_Org._id,email:IsExist_Org.email}
       const token = jwt.sign(payload,process.env.JWT_SECREATE,{expiresIn:'24h'})

       res.status(200).json({success:true,message:"Login SuccessFully",data:token})
    } catch (error) {
        console.log("Internal Server Error:",error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

exports.Organization_Details = async(req,res)=>{
    try {
       const user = req.user
       
       // Now Fetch The User.
       const OrgDetails = await Organization.findById(user._id)
       if(!OrgDetails){return res.status(400).json({success:false,message:"User Does Not Exist"})}

       // Return The User Info.
       res.status(200).json({success:true,message:"User Exist",data:OrgDetails})
    } catch (error) {
        console.log("Internal Server Error:",error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}