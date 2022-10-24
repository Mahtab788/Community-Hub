const reload = require('reload')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
app.use(express.static(`${__dirname}`))
const server = http.createServer(app)
const io = socketio(server)

const MAX_SIZE = 2

function updateMemberNumbers(sock, roomId, flag) {
  let members = io.sockets.adapter.rooms.get(roomId).size
  if (flag) sock.emit("update-members", members);
  sock.to(roomId).emit("update-members", members)
}

io.on("connection", (sock) => {
  let roomId = 'room-'+Math.random().toString(36).substring(2,13)
  let joinedRoom = ''

  sock.on("create-room", () => {
    // joining a specific room
    joinedRoom = roomId
    sock.join(joinedRoom)
    sock.emit("chat-room-active")
    
    // sending roomId when joining to a room
    updateMemberNumbers(sock, joinedRoom, true)
    sock.emit("join", "connected to ", joinedRoom, "info");
  })

  // receive a message from the client
  sock.on("message", msg => {
    sock.emit("message", msg, "right")   //emits to the sender
    sock.to(joinedRoom).emit("message", msg, "left")    //emits to users in same room, except the sender
  });

  sock.on("join", id => {
    if (!io.sockets.adapter.rooms.has(id)) return sock.emit("alert-msg", "Room does not exists")
    let clientsInRoom = io.sockets.adapter.rooms.get(id).size
    if (clientsInRoom >= MAX_SIZE) return sock.emit("alert-msg", "The room is already full", "info")
    sock.emit("chat-room-active")

    sock.emit("join", "connected to ",id, "info")
    sock.join(id)
    joinedRoom = id

    updateMemberNumbers(sock, joinedRoom, true)   //updating the room when joining a room
    sock.to(joinedRoom).emit("message", "new user connected", "info")
  })

  sock.on("join-room", (id, prevRoomId) => {
    if (!io.sockets.adapter.rooms.has(id)) return sock.emit("alert-msg", "Room does not exists")
    if (prevRoomId == id) return sock.emit("message", "Already in the "+id, "info")
    
    let clientsInRoom = io.sockets.adapter.rooms.get(id).size
    // console.log(clientsInRoom);
    if (clientsInRoom >= 2) return sock.emit("message", "The room is already full", "info")
    sock.emit("chat-room-active")    

    sock.leave(prevRoomId)
    sock.emit("join", "connected to ",id)
    sock.join(id)
    joinedRoom = id

    updateMemberNumbers(sock, prevRoomId, false)   //updating previous room
    sock.to(prevRoomId).emit("message", "A User left the Room..", "info")

    updateMemberNumbers(sock, joinedRoom, true)   //updating current room
    sock.to(joinedRoom).emit("message", "new user connected", "info")
  })

  sock.on("leave-room", () => {
    // if (!io.sockets.adapter.rooms.has(sock.id)) return sock.emit("alert-msg", "Room does not exists")
    sock.leave(joinedRoom)
    sock.emit("main-page-active")
    sock.emit("reset-room-id")

    if (io.sockets.adapter.rooms.get(joinedRoom) == undefined) return
    if (io.sockets.adapter.rooms.get(joinedRoom).size < 1) return   //perform below code when there are other users present
    sock.to(joinedRoom).emit("message", "A User left the Room..", "info")
    updateMemberNumbers(sock, joinedRoom, false)   //updating the currrent room from where the user left
  })

  sock.on("disconnect", () => {
    if (!io.sockets.adapter.rooms.has(sock.id)) return
    if (io.sockets.adapter.rooms.get(joinedRoom).size < 1) return
    sock.to(joinedRoom).emit("message", "A User got Disconnected", "info")
    updateMemberNumbers(sock, joinedRoom, false) 
  })
});

server.on("error", err => {
  console.log("There was an error", err);
})
server.listen(3000, () => {
  console.log("RPS started at 3000");
})

reload(app)