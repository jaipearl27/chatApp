import { insertRoom } from "../controllers/roomController";

let rooms = [];

//  add room in socket
export const addRoom = async (roomTitle, roomName, users, roomType, admins = []) => {

  let idx = rooms.findIndex((r) => r.roomName === roomName);

  if (idx < 0) {
    let roomData = {
      roomTitle: roomTitle,
      roomName: roomName,
      users: users,
      roomType: roomType,
      admins: admins,
    };

    const result = await insertRoom(roomData)

    if(result) {
      console.log(result)
      rooms.push(roomData);
      return { status: true, room: roomData };
    } else {
      return {status: false, message: 'Room data not inserted in DB'}
    }
  } else {

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
