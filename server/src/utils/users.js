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
