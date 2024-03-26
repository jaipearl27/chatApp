let users = [];

export const addUser = (user) => {
  let idx = users.findIndex((ele) => user.userName === ele.userName);

  if (idx < 0) {
    users.push(user);
    return { status: true };
  }
  return { status: false, users: users };
};

export const removeUser = (socketId) => {
  let idx = users.findIndex((user) => user.socketId === socketId);
  if (idx >= 0) {
    users.splice(idx, 1);
    return { status: true, users: users };
  }
  return { status: false, users: users };
};

export const findUser = (socketId) => {
  let idx = users.findIndex((user) => user.socketId === socketId);
};

// find active users in socekt as per required data
export const getActiveUsers = (data) => { 
  let processedData = data.map((e) => {
    e.status = users.some(user => user.userName === e.userName);
    return e;
  });
  
  return {status: true, users: processedData}
}

// get all active users in socket

export const getAllActiveUsers = () => {
  return {status: true, users: users}
}


// enter user in a room

export const enterRoom = (socketId, roomName) => {
  let idx = users?.findIndex((user) => user?.socketId === socketId)

  if(idx < 1){
    return {status: false, user:[], message: 'No user found joined in socket'}
  }

  users[idx].roomName = roomName
  return {status: true, user:users[idx], message: `User joined room ${roomName}`}
}


// update socketid if user exists in socket
export const updateSocketId = (userName, socketId) => {
  let idx = users?.findIndex((user) => user?.userName === userName)
  if(idx < 0 ){
    return {status: false, message: "no user in socket to update id for"}
  }
  users[idx].socketId = socketId
  return {status: true, message: "user socket id updated"}
}