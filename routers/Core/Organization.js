const express = require('express')
const router = express.Router()

const Org_Auth_Controller = require('../../controllers/Core/Organization/Auth')
const Middleware = require('../../middleware/Auth')


router.post('/create-organization',Org_Auth_Controller.Create_Organization)
router.post('/login-organization',Org_Auth_Controller.Login_Organization)
router.get('/get-organization',Middleware.OrgAuth,Middleware.IsOrgAuth,Org_Auth_Controller.Organization_Details)

module.exports = router