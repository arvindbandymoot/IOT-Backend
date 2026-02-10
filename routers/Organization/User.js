const express = require('express')
const router = express.Router()

const UserController = require('../../controllers/Organization/Manager/User')
const Middleware = require('../../middleware/Auth')

router.post('/enrolled-user',Middleware.ManagerAuth,Middleware.IsManagerAuth,UserController.Enroll_User)
router.get('/get-users',Middleware.ManagerAuth,Middleware.IsManagerAuth,UserController.GetUsers)
router.put('/update-user/:userId',Middleware.ManagerAuth,Middleware.IsManagerAuth,UserController.UpdateUser)
router.delete('/delete-user/:userId',Middleware.ManagerAuth,Middleware.IsManagerAuth,UserController.Delete_User)
router.get('/deleteAll-user/:deviceId',Middleware.ManagerAuth,Middleware.IsManagerAuth,UserController.DeleteAll_User)


module.exports = router;