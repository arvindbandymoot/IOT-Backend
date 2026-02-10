const mongoose = require('mongoose')

const Users_Schema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true
    },
    user_phone: {
        type: String,
        default: '+91 XXXX XXXX XX',
    },
    user_department: {
        type: String,
        default: "Empty"
    },
    user_roll: {
        type: String,
        required: true
    },
    devices: [{
        device: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Devices"
        },
        enrollment_id: String,
        enrollment_status: {
            type: String,
            enum: ["PENDING", "ACTIVE"],
            default: "PENDING"
        },
        enrollment_at: Date
    }],
    org_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    },
    manager_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manager'
    },
    createdBy: {
        type: String,
        default: null
    },
    updatedBy: {
        type: String,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model("User", Users_Schema)