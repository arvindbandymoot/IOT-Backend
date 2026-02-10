const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Manager = require('../models/Organization/Manager')

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  /* ---------- SOCKET AUTH ---------- */
  io.use(async(socket, next) => {
    const token = socket.handshake.auth.token;
    console.log(token)
    if (!token) return next(new Error("No token"));

    try {
      const user = jwt.verify(token, process.env.JWT_SECREATE);
      const manager = await Manager.findById(user.userId)
      console.log(user)
      socket.user = manager;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  /* ---------- SOCKET CONNECTION ---------- */
  io.on("connection", (socket) => {
    console.log("Connected:", socket.user.manager_name);

    //Join private room by userId
    socket.join(socket.user._id);
    console.log("Socket Room ID:", socket.user._id.toString());

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.user.manager_name);
    });
  });
}

function getIO() {
  if (!io) throw new Error("Socket not initialized");
  return io;
}

/* ---------- SEND TO SPECIFIC USER ---------- */
// function sendToUser(userId, event, data) {
//   if (!io) return;
//   console.log("Emitting to user:", userId.toString(), event, data);
//   io.to(userId.toString()).emit(event, data);
// }

function sendToUser(userId, event, data) {
  if (!io) return;

  const room = userId.toString();
  const socketsInRoom = io.sockets.adapter.rooms.get(room);

  console.log(
    "Room:", room,
    "Connected sockets:", socketsInRoom?.size || 0
  );

  io.to(room).emit(event, data);
}
module.exports = {
  initSocket,
  getIO,
  sendToUser,
};
