const express = require('express')
const router = express.Router()

const PaymentController = require('../../controllers/Organization/Organization/Payment')
const Middleware = require('../../middleware/Auth')

router.post('/create-payment',Middleware.OrgAuth,Middleware.IsOrgAuth,PaymentController.createOrder)
router.post('/verify-payment',Middleware.OrgAuth,Middleware.IsOrgAuth,PaymentController.verifyPayment)

module.exports = router