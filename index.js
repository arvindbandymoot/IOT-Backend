const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const http = require('http')

const ConnectDB = require('./config/database')
const mqttClient = require("./config/mqtt");

const {initSocket,getIO,sendToUser} = require('./socket/socket')
require("./controllers/mqtt/Enrollment_Handler")
require('./controllers/mqtt/Attendance_Handler')
require('./controllers/mqtt/DeviceStatus_Handler')


const Admin_Routes = require('./routers/Admin/AdminLogic')
const Org_Router = require('./routers/Core/Organization')
const Manager_Router = require('./routers/Core/Manager')
const Device_Router = require('./routers/Organization/Device')
const User_Router = require('./routers/Organization/User')
const Attendance_Router = require('./routers/Organization/Attendance')

//Payment Routes .
const Payment_Routes = require('./routers/Organization/Payment')
const Subscription_Routes = require('./routers/Organization/Subscription')

const app = express()
const server = http.createServer(app);

// Connect DataBase.
ConnectDB();

// Allow Cors-Orgin
app.use(cors({
    origin:["http://localhost:3000","http://137.97.126.110:3005"],
    methods:["GET","POST","DELETE","PUT"],
    credentials:true
}))

app.use(cookieParser())
app.use(express.json())

app.use('/api/admin',Admin_Routes)
app.use('/api/auth',Org_Router)
app.use('/api/payment',Payment_Routes)
app.use('/api/plan',Subscription_Routes)
app.use('/api/auth',Manager_Router)

app.use('/api/device',Device_Router)
app.use('/api/user',User_Router)
app.use('/api/attendance',Attendance_Router)

mqttClient.on("connect", () => {
  console.log("MQTT Connected");

  mqttClient.subscribe("device/+/scan");
  mqttClient.subscribe("device/+/enroll/result");
  mqttClient.subscribe("device/+/status")

  console.log("MQTT Subscribed");
});


//Initialize Socket Globally.
initSocket(server)


server.listen(process.env.PORT,()=>{
    console.log(`Backend Run Server At ${process.env.PORT}`)
})