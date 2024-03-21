let rooms = []

export const addRoom = (roomName, users, roomType, admins=[]) => {
    
    let idx = rooms.findIndex((r) => r.roomName === roomName)

    if(idx <= 0) {
        rooms.push({roomName: roomName, users: users, roomType: roomType, admins: admins})
    }
}

export const findRoom = (roomName) => {
    let idx = rooms.findIndex((r) => r.roomName === roomName)
    if(idx >= 0){
        return {status: true, idx: idx, roomName: roomName}
    }
}

export const changeRoom = (socketId, roomName) => {
    let userIdx = rooms.findIndex(
      (user) => user.socketId === socketId && user.roomName !== roomName
    );
    let roomIdx = findRoom(roomName)
    if (userIdx >= 0) {
      rooms[idx].roomName = roomName;
      return { status: true, user: rooms[idx] };
    }
    return { status: false };
  };