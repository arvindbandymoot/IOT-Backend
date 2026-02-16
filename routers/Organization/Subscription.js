const express = require('express')
const router = express.Router()
const SubscriptionController = require('../../controllers/Organization/Organization/Subscription')
const Middleware = require('../../middleware/Auth')

router.post('/subscription/plan',Middleware.OrgAuth,Middleware.IsOrgAuth,SubscriptionController.CreateSubscription)
router.get('/subscription/details',Middleware.OrgAuth,Middleware.IsOrgAuth,SubscriptionController.GetSubscription)
module.exports = router