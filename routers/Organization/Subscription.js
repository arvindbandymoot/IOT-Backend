const express = require('express')
const router = express.Router()
const SubscriptionController = require('../../controllers/Organization/Organization/Subscription')
const Middleware = require('../../middleware/Auth')

router.post('/subscription-plan',Middleware.AdminAuth,Middleware.IsAdmin,SubscriptionController.CreateSubscription)
module.exports = router