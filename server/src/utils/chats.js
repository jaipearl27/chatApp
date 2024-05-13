import { addMessage } from "../controllers/messageController.js";

let chats = [];


export const addChat = async (data) => {

  console.log(data?.roomTitle)

  let newMessage = {
    userId: data?.userId,
    userName: data?.userName,
    users: data?.users,
    roomName: data?.roomName,
    roomTitle: data?.roomTitle,
    roomType: data.roomType,
    message: data?.message,
    reactions: data?.reactions,
    readBy: data?.readBy,
    timestamp: data?.timestamp,
  };

  chats.push(newMessage);

  const messageData = await addMessage(newMessage)

  if (messageData?.status) {
    return { status: true, messageData: messageData };
  } else {
    return { status: false, message: 'Error sending message' };
  }
};

// export const getRoomChatHistory = (roomName) => {
//   // let chatHistory = [];
  
//   const chatHistory = getAllMessages(roomName)


//   // chats.forEach((chat) => {
//   //   if (chat?.roomName === roomName) {
//   //     chatHistory.push(chat);
//   //   }
//   // });

//   // if (chatHistory.length > 0) {
//   //   return { status: true, chats: chatHistory };
//   // }

//   return {
//     status: false,
//     chats: chatHistory,
//     message: `no chats found for room ${roomName}`,
//   };
// };
