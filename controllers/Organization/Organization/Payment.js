const razorpay = require("../../../config/razorpay");
const crypto = require("crypto");
const Payment = require("../../../models/Organization/Payment");
const Subscription = require('../../../models/Organization/Subscription')
const { calculateEndDate } = require('../../../utils/DateFromate/GetEndDate')

exports.createOrder = async (req, res) => {
  try {
    const user = req.user;
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    //Save order against user
    await Payment.create({
      userId: user._id,
      orderId: order.id,
      amount,
      status: "CREATED"
    });

    res.json({
      success: true,
      message:"Error During Creating Order",
      order
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const user = req.user;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    //Update payment for THIS user
    await Payment.findOneAndUpdate(
      {
        orderId: razorpay_order_id,
        userId: user._id
      },
      {
        paymentId: razorpay_payment_id,
        status: "SUCCESS"
      }
    );
    // Add Subscription Fro OrganiZation.
    const SubscriptionInfo = await Subscription.findOne({ OrgId: user._id })
    if(!SubscriptionInfo){
      return res.status(400).json({success:false,message:"Subscription Plan Are Not Find Plaeas Select Subscription Based Plan"})
    }

    SubscriptionInfo.startDate = new Date()
    SubscriptionInfo.endDate = calculateEndDate(SubscriptionInfo.plan)
    SubscriptionInfo.status = "ACTIVE"

    await SubscriptionInfo.save()


    res.json({
      success: true,
      message: "Payment successful"
    });

  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ success: false });
  }
};

exports.Get_Payments = async(req,res)=>{
  try {
    const user = req.user
    // Now Fetch The Payment History Of Organization.
    const payments = await Payment.find({userId:user._id})
    if(!payments){
      return res.status(400).json({success:false,message:"Payment Does Not Exist."})
    }
    res.status(200).json({success:true,message:"Fetch Payment SuccessFully",data:payments})
  } catch (error) {
    console.log("Internal Server Error:",error.message)
    res.status(500).json({success:false,message:"Internal Server Error"})
  }
}
