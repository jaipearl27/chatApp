import { Server } from "socket.io";
import {
  addUser,
  enterRoom,
  findUser,
  removeUser,
} from "../../src/utils/users.js";
import { addRoom, changeRoom } from "../utils/rooms.js";
import { addChat, getRoomChatHistory } from "../utils/chats.js";
import { getChatHistory } from "../controllers/messageController.js";

export function configureGroupChatNamespace(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  const groupChatNamespace = io.of("/groupChat");

  groupChatNamespace.on("connection", (socket) => {
    // user joins
    console.log(`user with ${socket.id} joined`);
    socket.on("join", async (userName, adminid) => {

      const chatHistory = await getChatHistory(userName)

      const newUser = {
        userName: userName,
        socketId: socket.id,
        room: {},
      };

      // user added to socket
      const result = addUser(newUser);

      if (adminid === process.env.ADMINID) {
        socket.emit("users", result.users);
      }
 
      if (chatHistory?.status) {
        socket.emit("chatHistory", chatHistory)
      }

    });

    // on room join
    socket.on("joinRoom", ({ roomTitle, roomName, users, roomType }, cb) => {
      const result = addRoom(roomTitle, roomName, users, roomType);
      if (result?.status) {
        const userData = enterRoom(socket.id, result?.room);

        if (userData?.previousRoom) {
          socket.leave(userData?.previousRoom)
        }

        socket.join(userData?.user?.room?.roomName);

        // getting chatHistory, if any
        const chatHistory = getRoomChatHistory(userData?.user?.room?.roomName);
        
        if (!chatHistory?.status) {
          console.error(chatHistory?.message);
        }


        cb({
          status: true,
          userData: userData,
          roomData: result?.room,
          chatHistory: chatHistory
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
          roomName: user.user?.room?.roomName,
          roomTitle: user?.user?.room?.roomTitle,
          message: data?.message,
          timestamp: timestamp,
          reactions: [],
          readBy: [{ userId: data?.userId, userName: user?.user?.userName }],
        }

        socket.emit("newMessage", messageData); // emit to the sender

        const messageDataResult = await addChat(messageData);


        if (messageDataResult?.status) {
          socket.to(user?.user?.room?.roomName).emit("newMessage", messageDataResult?.messageData?.data);
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
