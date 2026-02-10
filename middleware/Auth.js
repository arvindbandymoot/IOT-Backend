const Admin = require('../models/Admin/Admin')
const Organization = require('../models/Organization/Organization')
const Manager = require('../models/Organization/Manager')
const jwt = require('jsonwebtoken')

exports.OrgAuth = async(req ,res,next)=>{
    try {
        const token = req.header('Authorization')?.replace('Bearer ','')||req.cookies.token||req.body.token

        if(!token){
            return res.status(400).json({success:false,message:"Token Missing"})
        }

        const decode = jwt.verify(token,process.env.JWT_SECREATE)
        const organization = await Organization.findById(decode.userId)
        if(!organization){
            return res.status(400).json({success:false,message:"Invalid Token"})
        }
        req.user = organization
        next()
    } catch (error) {
        console.log("Internal Server Error:",error)
        return resizeBy.status(500).json({success:false,message:"Internal Server Error"})
    }
}
exports.IsOrgAuth = async(req,res,next)=>{
    try {
        if(req.user.role !== 'Organization'){
            return res.status(400).json({success:false,message:"This Routes Protected For Organization"})
        }
        next()
    } catch (error) {
       console.log("Internal Server Error:",error)
       return res.status(500).json({success:false,message:"Middleware Error"}) 
    }
}

exports.ManagerAuth = async(req ,res,next)=>{
    try {
        const token = req.header('Authorization')?.replace('Bearer ','')||req.cookies.token||req.body.token

        if(!token){
            return res.status(400).json({success:false,message:"Token Missing"})
        }

        const decode = jwt.verify(token,process.env.JWT_SECREATE)
        const manager = await Manager.findById(decode.userId)
        if(!manager){
            return res.status(400).json({success:false,message:"Invalid Token"})
        }
        req.user = manager
        next()
    } catch (error) {
        console.log("Internal Server Error:",error)
        return resizeBy.status(500).json({success:false,message:"Internal Server Error"})
    }
}
exports.IsManagerAuth = async(req,res,next)=>{
    try {
        if(req.user.role !== "Manager"){
            return res.status(400).json({success:false,message:"This routes Protected For Manager"})
        }
        next()
    } catch (error) {
        console.log("Internal Server Error:",error)
        res.status(500).json({success:false,message:"Middleware Issue IsManagerAuth"})
    }
}

exports.AdminAuth = async(req,res,next)=>{
    try {
        const token = req.header('Authorization')?.replace('Bearer ','')||req.cookies.token||req.body.token
        if(!token){
            return res.status(400).json({success:false,message:"Token Missing"})
        }
        //Now Decode The Token
        const decode = jwt.verify(token,process.env.JWT_SECREATE)
        const AdminDetails = await Admin.findById(decode.userId)
        if(!AdminDetails){
            return res.status(400).json({success:false,message:"Invalid Token"})
        }
        req.user = AdminDetails
        next()
        
    } catch (error) {
        console.log("Internal Server Error:",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}
exports.IsAdmin = async(req,res,next)=>{
    try {
        if(req.user.role !=="Admin"){
            return res.status(400).json({success:false,message:"This Routes Protected For Admin"})
        }
        next()
    } catch (error) {
        console.log("Internal Server Error:",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}