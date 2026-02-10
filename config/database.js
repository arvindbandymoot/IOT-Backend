const mongoose = require('mongoose')
const console = require('../utils/Settings/logger')
const dotenv = require('dotenv')
dotenv.config()

const ConnectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDB Connected SuccessFully Port:${conn.connection.host}`)
    } catch (error) {
        console.log("Error Connecting To MongoDB",error.message)
        process.exit(1)
    }
}

module.exports = ConnectDB