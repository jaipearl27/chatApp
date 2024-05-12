let users = [];

// add user data in socket
export const addUser = ({userName, socketId, room}) => {
  let idx = users.findIndex((ele) => userName === ele.userName);
  
  if (idx < 0) {
    users.push({userName, socketId, room});
    return { status: true };
  }
  return { status: false, users: users };
};

// remove user data form socket

export const removeUser = (socketId) => {
  let idx = users.findIndex((user) => user.socketId === socketId);
  console.log(`${users[idx]?.userName} leaving socket`)
  if (idx >= 0) {
    users.splice(idx, 1);
    return { status: true, users: users };
  }
  return { status: false, users: users };
};

// find user as per socket id

export const findUser = async (socketId) => {
  // console.log(users)
  // console.log('socket id in find User', socketId)
  let idx = users.findIndex((user) => user.socketId === socketId);
  if(idx >= 0){
    return {status: true, user: users[idx]}
  }
  return {status: false, message: 'user not found'}

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

export const enterRoom = (socketId, room) => {
  let idx = users?.findIndex((user) => user?.socketId === socketId)

  if(idx < 0){
    return {status: false, user:[], message: 'No user found joined in socket'}
  }
  
  let previousRoom = users[idx]?.room

  if(previousRoom?.length > 0) {
    users[idx].room
    return {status: true,  previousRoom: previousRoom, user:users[idx],message: `User joined room ${room.roomName}`}
  }
  users[idx].room = room
  return {status: true,  user:users[idx],message: `User joined room ${room.roomName}`}
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