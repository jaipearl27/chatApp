import { getRoomChatHistory } from "./chats.js";

let rooms = [];

//  add room in socket
export const addRoom = (roomTitle, roomName, users, roomType, admins = []) => {
  let idx = rooms.findIndex((r) => r.roomName === roomName);
  // console.log(idx);

   // getting chatHistory, if any
   const chatHistory = getRoomChatHistory(roomName);

   if (!chatHistory?.status) {
     console.error(chatHistory?.message);
   }

  if (idx < 0) {
    let roomData = {
      roomTitle: roomTitle,
      roomName: roomName,
      users: users,
      roomType: roomType,
      admins: admins,
    };

    rooms.push(roomData);

    return { status: true, room: roomData, chatData: chatHistory };
  }

  //  bruh, if already exits then user is probably changing room
  return { status: true, room: rooms[idx], chatData: chatHistory };
};

// find room in socket
export const findRoom = (roomName) => {
  let idx = rooms.findIndex((r) => r.roomName === roomName);
  if (idx >= 0) {
    return { status: true, idx: idx, roomName: roomName };
  }
};

// change room in socket
export const changeRoom = (socketId, roomName) => {
  let userIdx = rooms.findIndex(
    (user) => user.socketId === socketId && user.roomName !== roomName
  );
  let roomIdx = findRoom(roomName);
  if (userIdx >= 0) {
    rooms[roomIdx].roomName = roomName;
    return { status: true, user: rooms[roomIdx] };
  }
  return { status: false };
};
