import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { IoSearchOutline } from "react-icons/io5";
import { BsSend } from "react-icons/bs";

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
    socket.emit("message", { username: username, message: messageInput });
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
      <div className="w-full text-2xl text-center">User: {username}</div>
      <div
        className={` w-[800px] flex flex-row mx-auto mt-2 border border-gray-400 rounded-lg`}
      >
        <div className="w-2/6 border border-gray-400 text-white overflow-y-auto flex flex-col">
          {/* search input */}
          <div className="w-full flex flex-col justify-center relative p-2">
            <input
              type="text"
              placeholder="Enter MRN Number "
              className="rounded-full px-3 py-1 border border-gray-400"
            />
            <IoSearchOutline
              className="absolute z-[999] right-4 text-black"
              size={20}
            />
          </div>
          {users &&
            users
              ?.filter((u) => u?.username !== username)
              ?.map((user) => (
                <div
                  key={user?.socketId}
                  className="w-full p-2 text-black cursor-pointer transition duration-300"
                  onClick={() => joinRoom(user?.username)}
                >
                  {user?.username}
                </div>
              ))}
        </div>

        <div className={`w-4/6 bg-white flex flex-col`}>
          {/* room name */}
          <div className="w-full border border-x-0 border-y-1 border-gray-300 text-white h-[50px] flex flex-col justify-center text-lg pl-4">
            {room?.length > 0 ? (
              <div className="flex flex-row gap-2 h-[35px]">
                <div className="h-[35px] w-[35px] flex flex-col justify-center relative">
                  <img
                    src="/noProfilePic.webp"
                    alt="no profile pic"
                    className="w-[35px] h-[35px] rounded-full absolute"
                  />
                  <span className="h-[8px] w-[8px] bg-[#53ff31] rounded-full absolute bottom-0 right-0"></span>
                </div>
                <div className="h-full text-black flex flex-col">
                  <span className="font-medium text-[16px]" >
                    {room}
                  </span>
                  <span className="text-xs font-[10px]">
                    Available
                  </span>
                </div>
              </div>
            ) : (
              "Select a user to talk to"
            )}
          </div>
          {/* chat box */}
          <div className="w-full h-[500px] overflow-y-auto overflow-x-hidden flex flex-col gap-2 px-2 py-6">
            {room?.length > 0 && (
              <>
                {messages &&
                  messages?.map((message, idx) => (
                    <div key={idx}>
                      {message?.username == username ? (
                        <>
                          {/* message right */}
                          <div className="w-full flex flex-row justify-end">
                            <div className="flex flex-col gap-2 text-right relative">
                              <small className="text-[10px] pr-1">
                                12/03/2024
                              </small>
                              <div>
                                <span
                                  className="bg-[#00116c]
                              text-white text-center px-3 py-2 shadow-xs text-wrap break-words"
                                  style={{ borderRadius: "5px 5px 0 5px" }}
                                >
                                  {message?.message}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* message left */}
                          <div className="w-full flex">
                            <div className="flex flex-row gap-1">
                              <div className="h-full flex flex-col justify-center">
                                <img
                                  src="/noProfilePic.webp"
                                  alt="no profile pic"
                                  className="w-[30px] h-[30px] rounded-full relative"
                                />
                              </div>
                              <div className="flex flex-col gap-[2px] text-left relative">
                                <small className="text-[10px] absolute -top-4">
                                  12/03/2024
                                </small>
                                <span
                                  className="bg-[#ececff] text-gray-700 border px-3 py-1 shadow-xs text-wrap break-words"
                                  style={{ borderRadius: "5px 5px 5px 0" }}
                                >
                                  {message?.message}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </>
            )}
          </div>
          <div className="flex gap-2 border border-y-1 border-gray-400 p-2">
            {room?.length > 0 && (
              <>
                <input
                  type="text"
                  className="w-full text-center p-1 border border-gray-200 bg-[#ececff] rounded-md"
                  placeholder="Type something here"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <button
                  type="button"
                  className="w-fit p-1 rounded-md bg-[#00116c] hover:bg-[#000b41] text-white"
                  onClick={handleMessageSend}
                >
                  <BsSend size="40" />
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
