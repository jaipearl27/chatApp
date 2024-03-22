import { Server } from "socket.io";
import { addUser, removeUser } from "../../src/utils/users.js";
import { addRoom, changeRoom } from "../utils/rooms.js";

export function configureOneToOneNamespace(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  const oneToOneNamespace = io.of("/onetoone");

  oneToOneNamespace.on("connection", (socket) => {
    // user joins
    console.log(`user with ${socket.id} joined`);
    socket.on("join", async (username, adminid) => {
      // new user added to local object

    //   const employees = await getAllEmployees();
    //   console.log(employees);

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
    socket.on("joinRoom", ({roomTitle, roomName, users, roomType}, cb) => {
      const result = addRoom(roomTitle,roomName, users, roomType );
      if (result.status) {
        console.log(result)
        socket.join(result?.room?.roomName);
        // const newMessage = `${result?.user?.username} joined the room`;
        // io.to(roomName).emit("newMessage", {username: result?.user?.username, message: newMessage});
        cb({ status: true, room: result.room });
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

  return oneToOneNamespace;
}
