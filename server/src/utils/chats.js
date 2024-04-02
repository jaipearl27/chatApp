import { addMessage } from "../controllers/messageController.js";

let chats = [];

// _id - id for the message that MongoDB creted after saving it in the DB

// username - as name suggests name of user that sent the message

// readBy - array of username that tells if this chat has been read or not by the user

// roomId - username 1 + username 2 ... + username n

// message - message content

//reactions - [{'userId','userName', 'reaction'}]

export const addChat = async (
  userId,
  userName,
  roomName,
  message,
  reactions = [],
  readBy = []
) => {
  let date = new Date();
  let dateString = date.toString();
  let splitDate = dateString.split(" ");
  let timestamp = `${splitDate[2]} ${splitDate[1]} ${splitDate[3]} ${splitDate[4]} `;

  let newMessage = {
    userId: userId,
    userName: userName,
    roomName: roomName,
    message: message,
    reactions: reactions,
    readBy: readBy,
    timestamp: timestamp,
  };

  chats.push(newMessage);

  return { status: true, messageData: newMessage };
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
