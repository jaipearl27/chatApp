const express = require("express");
const app = express();
const socket = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT || 6969;

const server = app.listen(PORT, () => console.log(`Server started on ${PORT}`));

const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

let users = [];

const addUser = (user) => {
  let idx = users.findIndex((ele) => user.username === ele.username);

  if (idx < 0) {
    users.push(user);
    return { status: true };
  }
  return { status: false };
};

const removeUser = (socketId) => {
  let idx = users.findIndex((user) => user.socketId === socketId);
  if (idx >= 0) {
    users.splice(idx, 1);
    return { status: true };
  }
  return { status: false };
};


const changeRoom = (socketId, roomName) => {
  let idx = users.findIndex((user) => user.socketId === socketId && user.roomName !== roomName);
  if (idx >= 0) {
    users[idx].roomName = roomName;
    return { status: true, user: users[idx] };
  }
  return { status: false };
};

io.on("connection", (socket) => {
  // user joins
  socket.on("join", (username,adminid) => {
    // new user added to local object
    const newUser = {
      username: username,
      socketId: socket.id,
      roomName: username,
    };

    const result = addUser(newUser);

    if(adminid === process.env.ADMINID){
      socket.emit("users", users)
    }

    changeRoom(socket.id, username);

    socket.join(username);
    socket.emit('newMessage', {username: result?.user?.username, message: `Welcome to the room ${username}`})

    socket.broadcast.to(username).emit('newMessge', {username: result?.user?.username, message: `${username} just joined the room`} )
    // Emit user count to all users if the user is new
    if (result.status) {
      io.emit("users", users);
    }
  });

  // on room join
  socket.on("joinRoom", (roomName,cb) => {
    const result = changeRoom(socket.id, roomName);
    if(result.status){
      socket.join(roomName);
      const newMessage = `${result?.user?.username} joined the room`;
      io.to(roomName).emit("newMessage", {username: result?.user?.username, message: newMessage});
      cb({status: true, roomName:roomName })
    }
    cb({status: false})
  });

  //on message
  socket.on("message", (data) => {
    const idx = users.findIndex((user) => user?.socketId === socket.id)
    socket.emit('newMessage', data)
    socket.broadcast.to(users[idx]?.roomName).emit('newMessage', data )
    
  })

  // socket disconnected and user is taken out of socket as well as list on frontend by emitting new object
  socket.on("disconnect", () => {
    const result = removeUser(socket.id);
    if (result.status) io.emit("users", users);
    console.log(`user with id ${socket.id} left`);
  });
});
