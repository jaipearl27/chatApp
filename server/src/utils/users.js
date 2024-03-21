let users = [];

export const addUser = (user) => {
  let idx = users.findIndex((ele) => user.username === ele.username);

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
