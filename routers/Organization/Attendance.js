const express = require('express')
const router = express.Router()

const Attendance_Controller = require('../../controllers/Organization/Manager/Attendance')
const Middleware = require('../../middleware/Auth')

router.get('/get-attendance/:empId/:from/:to',Middleware.ManagerAuth,Middleware.IsManagerAuth,Attendance_Controller.GetAttendance)

module.exports = router