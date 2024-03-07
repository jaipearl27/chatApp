const express = require('express')
const app = express();
const socket = require('socket.io');
const cors = require('cors');
const PORT  = process.env.PORT || 6969;

const server = app.listen(PORT, () =>
  console.log(`Server started on ${PORT}`)
);

const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
});
  
let users = []

const addUser = (user) => {
    let idx = users.findIndex(ele => user.username === ele.username )
    
    if(idx < 0) {
        users.push(user)
        return {status: true};
    }
    return {status: false}
}

const removeUser = (socketId) => {
    let idx = users.findIndex(user => user.socketId === socketId)
    if(idx >= 0) users.splice(idx, 1)
}



io.on('connection', (socket) => {
    // console.log(`user with id ${socket.id} joined`)
    socket.on('join', (username) => {
        console.log(username)
        const newUser = {username: username,socketId: socket.id}
        const result = addUser(newUser)
        if(result.status) io.emit('users',newUser)
    })


    socket.on('disconnect', () => {
        removeUser(socket.id)
        console.log(`user with id ${socket.id} left`)
    })
})




