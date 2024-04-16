import { Server } from "socket.io";
import {
  addUser,
  enterRoom,
  findUser,
  removeUser,
} from "../../src/utils/users.js";
import { addRoom, changeRoom } from "../utils/rooms.js";
import { addChat } from "../utils/chats.js";

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

      const newUser = {
        userName: userName,
        socketId: socket.id,
        roomName: "",
      };

      // user added to socket
      const result = addUser(newUser);

      if (adminid === process.env.ADMINID) {
        socket.emit("users", result.users);
      }

      // socket.emit('newMessage', {userName: result?.user?.userName, message: `Welcome to the room ${userName}`})

      // socket.broadcast.to(userName).emit('newMessge', {userName: result?.user?.userName, message: `${userName} just joined the room`} )

      // Emit user count to all users if the user is new

      // if (result.status) {
      //   io.emit("users", result.users);
      // }
    });

    // on room join
    socket.on("joinRoom", ({ roomTitle, roomName, users, roomType }, cb) => {
      const result = addRoom(roomTitle, roomName, users, roomType);
      // console.log(result);
      if (result?.status) {
        const userData = enterRoom(socket.id, result?.room?.roomName);
        if(userData?.previousRoom){
          socket.leave(userData?.previousRoom)
        }
        socket.join(userData?.user?.roomName);
        cb({
          status: true,
          userData: userData,
          roomData: result,
        });
      }
      cb({ status: false });
    });

    //on message
    socket.on("message", async (data) => {
      const user = await findUser(socket.id);

      if (user) {
        
        let date = new Date();
        let dateString = date.toString();
        let splitDate = dateString.split(" ");
        let timestamp = `${splitDate[2]} ${splitDate[1]} ${splitDate[3]} ${splitDate[4]}`;

        const messageData = {
          userId: data?.userId,
          userName: user?.user?.userName,
          roomName: user.user?.roomName,
          message: data?.message,
          timestamp: timestamp,
          reactions: [],
          readBy: [{userId: data?.userId, userName: user?.user?.userName}],        
        }

        socket.emit("newMessage", messageData); // emit to the sender

        const messageDataResult = await addChat(messageData);


        if (messageDataResult?.status) {
          socket.to(user?.user?.roomName).emit("newMessage", messageDataResult);
        }
      }
    });

    // socket disconnected and user is taken out of socket as well as list on frontend by emitting new object
    socket.on("disconnect", () => {
      const result = removeUser(socket.id);
      if (result.status) io.emit("users", result.users);
    });
  });

  return oneToOneNamespace;
}
