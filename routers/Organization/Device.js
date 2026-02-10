const express = require('express')
const router = express.Router()

const DeviceController = require('../../controllers/Organization/Manager/Device')
const Middleware = require('../../middleware/Auth')

router.post('/add-device',Middleware.ManagerAuth,Middleware.IsManagerAuth,DeviceController.Add_Device)
router.get('/get-device',Middleware.ManagerAuth,Middleware.IsManagerAuth,DeviceController.Get_Device)
router.put('/update-device/:deviceId',Middleware.ManagerAuth,Middleware.IsManagerAuth,DeviceController.Update_Device)
router.delete('/delete-device/:deviceId',Middleware.ManagerAuth,Middleware.IsManagerAuth,DeviceController.Delete_Device)

module.exports = router

