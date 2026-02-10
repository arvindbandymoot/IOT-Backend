const express = require('express')
const router = express.Router()
const AdminController = require('../../controllers/Admin/AdminLogic')
const Middleware = require('../../middleware/Auth')

router.get('/get-organizations',Middleware.AdminAuth,Middleware.IsAdmin,AdminController.GetOrganization)
router.post('/update-status',Middleware.AdminAuth,Middleware.IsAdmin,AdminController.UpadateStatus_Org)
router.post('/get-org/devices',Middleware.AdminAuth,Middleware.IsAdmin,AdminController.GetOrg_Devices)
module.exports = router