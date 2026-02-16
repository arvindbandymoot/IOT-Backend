const express = require('express')
const router = express.Router()

const PaymentController = require('../../controllers/Organization/Organization/Payment')
const Middleware = require('../../middleware/Auth')

router.post('/create-order',Middleware.OrgAuth,Middleware.IsOrgAuth,PaymentController.createOrder)
router.post('/verify-payment',Middleware.OrgAuth,Middleware.IsOrgAuth,PaymentController.verifyPayment)
router.get('/get-payments',Middleware.OrgAuth,Middleware.IsOrgAuth,PaymentController.Get_Payments)

module.exports = router