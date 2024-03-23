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
    socket.on("join", async (userName, adminid) => {
      // new user added to local object

    //   const employees = await getAllEmployees();
    //   console.log(employees);

      const newUser = {
        userName: userName,
        socketId: socket.id,
        roomName:"",
      };

      const result = addUser(newUser);

      if (adminid === process.env.ADMINID) {
        socket.emit("users", result.users);
      }

      // changeRoom(socket.id, userName);

      // socket.join(userName);
      // socket.emit('newMessage', {userName: result?.user?.userName, message: `Welcome to the room ${userName}`})

      // socket.broadcast.to(userName).emit('newMessge', {userName: result?.user?.userName, message: `${userName} just joined the room`} )
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
        // const newMessage = `${result?.user?.userName} joined the room`;
        // io.to(roomName).emit("newMessage", {userName: result?.user?.userName, message: newMessage});
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
