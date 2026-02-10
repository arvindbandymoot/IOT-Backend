const Admin = require('../../../models/Admin/Admin')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.RegisterAdmin = async(req ,res)=>{
    try {
        const {name,email,password} = req.body
        if(!name||!email||!password){
            return res.status(400).json({success:false,message:"All Field Are Required"})
        }

        //Check This Email Already Exist Or Not.
        const AdminDetails = await Admin.findOne({email})
        if(AdminDetails){
            return res.status(409).json({success:false,message:"Already Register"})
        }
        //Now Hash The Password.
        const hashpassword = await bcrypt.hash(password,10)
        //Now Create The Admin Data.
        const NewAdmin = new Admin({
            name,email,password:hashpassword
        })
        await NewAdmin.save()
        res.status(201).json({success:true,message:"Admin Create SuccessFully"})
    } catch (error) {
        console.log("Internal Server Error:",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}
exports.LoginAdmin = async(req,res)=>{
    try {
        const {email,password}= req.body
        if(!email||!password){
            return res.status(400).json({success:false,message:"All Field Are Required"})
        }
        //Now Check The Email Are Exist In Table Or NOt.
        const userExist = await Admin.findOne({email})
        if(!userExist){
            return res.status(400).json({success:false,message:"Admin User Does Not Exist"})
        }
        //Now Comapre The Password.
        const IsCorrectPassword = await bcrypt.compare(userExist.password,password)
        if(!IsCorrectPassword){
            return res.status(400).json({success:false,message:"Password Does Not Match"})
        }
        //Now Create The Jwt Token.
        let payload = {userId:userExist._id,email:userExist.email,role:userExist.role}
        const token = jwt.sign(payload,process.env.JWT_SECREATE,{expiresIn:'24h'})
        res.status(200).json({success:true,message:"Login SuccessFully",data:token})
    } catch (error) {
        console.log("Internal Server Error:",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}
exports.GetAdmin = async(req,res)=>{
    try {
        const user = req.user
        const userDetails = await Admin.findById(user._id)
        if(!userDetails){
            return res.status(400).json({success:false,message:"user Does Not Exist"})
        }
        res.status(200).json({success:true,message:"Admin Details Fetch SuccessFully",data:userDetails})
    } catch (error) {
        console.log("Internal Server Error:",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}