let rooms = [];

export const addRoom = (roomTitle, roomName, users, roomType, admins = []) => {
  let idx = rooms.findIndex((r) => r.roomName === roomName);
  console.log(idx)
  if (idx < 0) {
    let roomData = {
      roomTitle: roomTitle,
      roomName: roomName,
      users: users,
      roomType: roomType,
      admins: admins,
    };
    rooms.push(roomData);
    console.log("Rooms=======", rooms)
    return { status: true, room: roomData };
  }
  console.log("existing Rooms=======", rooms)
  //  bruh, if already exits then user is probably changing room
  return { status: true, room: rooms[idx] };
};

export const findRoom = (roomName) => {
  let idx = rooms.findIndex((r) => r.roomName === roomName);
  if (idx >= 0) {
    return { status: true, idx: idx, roomName: roomName };
  }
};

export const changeRoom = (socketId, roomName) => {
  let userIdx = rooms.findIndex(
    (user) => user.socketId === socketId && user.roomName !== roomName
  );
  let roomIdx = findRoom(roomName);
  if (userIdx >= 0) {
    rooms[idx].roomName = roomName;
    return { status: true, user: rooms[idx] };
  }
  return { status: false };
};
