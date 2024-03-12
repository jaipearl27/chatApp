import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:6969");

function ChatRoom({ username, setUsername }) {
  console.log("current user:", username);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState("");
  const [isJoined, setIsJoined] = useState(false); // Track whether join event is emitted

  // const messageInput = useRef()

  // emit for joining and sending your data
  useEffect(() => {
    joinEmit();
  }, []);

  // user joining emit on page load
  const joinEmit = () => {
    if (!isJoined) {
      socket.emit("join", username);
      setIsJoined(true);
      setRoom(username);
    }
    console.log("joining");
  };

  // socket.on for getting users data on join
  socket.on("users", (users) => {
    setUsers(users);
  });

  useEffect(() => {
    socket.on("messages", (messages) => {
      setMessages(messages);
    });
  }, []);

  useEffect(() => {
    // Setup event listener for incoming messages
    socket.on("newMessage", (data) => {
      setMessages([...messages, data]);
      console.log("new message", data);
    });

    // Cleanup the event listener when the component unmounts
    return () => {
      socket.off("newMessage");
    };
  }, [messages]); // Only re-run this effect if messages change

  const handleMessageSend = () => {
      // alert('sending message')
      socket.emit("message", {username: username,message: messageInput});
      setMessageInput("");
    
  };

  const joinRoom = (roomName) => {
    socket.emit("joinRoom", roomName, (data) => {
      if (data?.status) {
        setRoom(data?.roomName);
        
      } else {
        console.log("user already in the room");
      }
    });
    // console.log('emitting Join Room')
  };

  const removeLocal = () => {
    localStorage.removeItem("username");
    setUsername("");
  };

  return (
    <>
      <button onClick={removeLocal}>remove user</button>
      <div className={`rounded w-2/3 flex flex-row mx-auto mt-2 border border-gray-500 `}>
        {username === "admin" && (
          <div className="w-1/4 bg-gray-700 text-white overflow-y-auto flex flex-col">
            <div className="w-full bg-gray-600 text-white h-[50px] flex flex-col justify-center text-[14px] pl-2 ">
              Online Users ({users.length - 1})
            </div>
            {users &&
              users
                ?.filter((u) => u?.username !== username)
                ?.map((user) => (
                  <div
                    key={user?.socketId}
                    className="w-full bg-slate-400  hover:bg-slate-500  p-2 text-black hover:text-white cursor-pointer transition duration-300"
                    onClick={() => joinRoom(user?.username)}
                  >
                    {user?.username}
                  </div>
                ))}
          </div>
        )}
        <div className={`${username === 'admin' ? 'w-3/4' : 'w-full'} bg-slate-100 flex flex-col`}>
          {/* room name */}
          <div className="w-full bg-gray-600 text-white h-[50px] flex flex-col justify-center text-lg pl-4">
            {room?.length > 0 ? room : "Select a user to talk to"}
          </div>
          {/* chat box */}
          <div className="w-full h-[500px] overflow-y-auto overflow-x-hidden flex flex-col gap-2 px-4 py-3">
            {room?.length > 0 && (
              <>
                {messages &&
                  messages?.map((message, idx) => (
                    <div key={idx}>
                      {message?.username == username ? (
                        <>
                          {/* message right */}
                          <div className="w-full flex flex-row-reverse">
                            <div className="flex flex-col gap-[2px] text-right">
                              <span
                                className="bg-blue-500 
                              text-white rounded-2xl w-fit px-3 py-1 border border-gray-300 shadow"
                              >
                                {message?.message}
                              </span>
                              <small className="text-[10px] pr-2">
                                12/03/2024
                              </small>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* message left */}
                          <div className="w-full flex">
                            <div className="flex flex-col gap-[2px] text-left">
                              <span className="bg-white text-black rounded-2xl border border-gray-300 w-fit px-3 py-1 shadow">
                                {message?.message}
                              </span>
                              <small className="text-[10px] pl-2">
                                12/03/2024
                              </small>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </>
            )}
          </div>
          <div className="flex">
            {room?.length > 0 && (
              <>
                <input
                  type="text"
                  className="w-full p-2 border-none"
                  placeholder="Enter your message"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <button
                  type="button"
                  className="w-[100px] bg-blue-500 hover:bg-blue-700 text-white"
                  onClick={handleMessageSend}
                >
                  Send
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatRoom;
