const express = require('express')
const router = express.Router()

const Manager_Controller = require('../../controllers/Core/Organization/Manager')
const Middleware = require('../../middleware/Auth')

router.post('/signup/manager',Middleware.OrgAuth,Middleware.IsOrgAuth,Manager_Controller.Create_Manager)
router.post('/login/manager',Manager_Controller.Login_Manager)
router.get('/manager',Middleware.ManagerAuth,Middleware.IsManagerAuth,Manager_Controller.Manager_Details)

module.exports = router