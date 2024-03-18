import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import { addUser, removeUser, changeRoom } from "./src/utils/users.js";
import { mongoConnect } from "./src/configs/mongoDB.js";

// importing controllers
import { getAllEmployees } from "./src/controllers/employeeController.js";

const app = express();
const PORT = process.env.PORT || 6969;

// -------------------------------------------CORS HANDLING---------------------------------------------------
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    exposedHeaders: ["*", "Authorization"],
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// connecting MongoDB

mongoConnect();

// root get request
app.get("/", (req, res) => {
  res.send(`Not allowed you simp, go back.`);
});

const oneToOneNamespace = io.of("/onetoone");

oneToOneNamespace.on("connection", (socket) => {
  // user joins
  console.log(`user with ${socket.id} joined`);
  socket.on("join", async (username, adminid) => {
    // new user added to local object

    const employees = await getAllEmployees();
    console.log(employees);

    // debugger;
    const newUser = {
      username: username,
      socketId: socket.id,
      roomName: username,
    };

    const result = addUser(newUser);

    if (adminid === process.env.ADMINID) {
      socket.emit("users", result.users);
    }

    changeRoom(socket.id, username);

    socket.join(username);
    // socket.emit('newMessage', {username: result?.user?.username, message: `Welcome to the room ${username}`})

    // socket.broadcast.to(username).emit('newMessge', {username: result?.user?.username, message: `${username} just joined the room`} )
    // Emit user count to all users if the user is new
    if (result.status) {
      io.emit("users", result.users);
    }
  });

  // on room join
  socket.on("joinRoom", (roomName, cb) => {
    const result = changeRoom(socket.id, roomName);
    if (result.status) {
      socket.join(roomName);
      // const newMessage = `${result?.user?.username} joined the room`;
      // io.to(roomName).emit("newMessage", {username: result?.user?.username, message: newMessage});
      cb({ status: true, roomName: roomName });
    }
    cb({ status: false });
  });

  //on message
  // socket.on("message", (data) => {
  //     const idx = users.findIndex((user) => user?.socketId === socket.id);
  //     socket.emit("newMessage", data);
  //     socket.broadcast.to(users[idx]?.roomName).emit("newMessage", data);
  // });

  // socket disconnected and user is taken out of socket as well as list on frontend by emitting new object
  socket.on("disconnect", () => {
    const result = removeUser(socket.id);
    if (result.status) io.emit("users", result.users);
    console.log(`user with id ${socket.id} left`);
  });
});

server.listen(PORT, () => console.log(`Server started on ${PORT}`));
