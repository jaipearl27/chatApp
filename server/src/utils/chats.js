import { addMessage } from "../controllers/messageController.js";

let chats = [];

// _id - id for the message that MongoDB creted after saving it in the DB

// username - as name suggests name of user that sent the message

// readBy - array of username that tells if this chat has been read or not by the user

// roomId - username 1 + username 2 ... + username n

// message - message content

//reactions - [{'userId','userName', 'reaction'}]

export const addChat = async (
  data
) => {
  

  let newMessage = {
    userId: data?.userId,
    userName: data?.userName,
    roomName: data?.roomName,
    message: data?.message,
    reactions: data?.reactions,
    readBy: data?.readBy,
    timestamp: data?.timestamp,
  };

  chats.push(newMessage);
  
  const messageData = await addMessage(newMessage)
  
  if(messageData?.status) {
    return { status: true, messageData: messageData };
  } else {
    return { status: false, message: 'Error sending message' };
  }
};

export const getRoomChatHistory = (roomName) => {
  let chatHistory = [];

  chats.forEach((chat) => {
    if (chat?.roomName === roomName) {
      chatHistory.push(chat);
    }
  });

  if (chatHistory.length > 0) {
    return { status: true, chatHistory: chatHistory };
  }

  return {
    status: false,
    chatHistory: chatHistory,
    message: `no chats found for room ${roomName}`,
  };
};
