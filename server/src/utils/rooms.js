import { insertRoom } from "../controllers/roomController.js";

let rooms = [];

//  add room in socket
export const addRoom = async (
  roomTitle,
  roomName,
  users,
  roomType,
  admins = []
) => {
  let idx = rooms.findIndex((r) => r.roomName === roomName);

  let roomData = {
    roomTitle: roomTitle,
    roomName: roomName,
    users: users,
    roomType: roomType,
    admins: admins,
  };

  const result = await insertRoom(roomData);
  if (idx < 0 && result.status) {
    // console.log(result)
    rooms.push(roomData);
    // console.log(rooms)
    return { status: true, room: roomData };
  } else if(idx >= 0 && result.status) {
    rooms[idx] = roomData;
    return { status: true, room: roomData, message:'room changes' };
  } else {
    return { status: false, message: "Error changing/inserting room" };
  }
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
