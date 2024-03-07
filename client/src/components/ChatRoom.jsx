import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:6969");

function ChatRoom({ username }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState("");
  const [isJoined, setIsJoined] = useState(false); // Track whether join event is emitted
  
  // emit for joining and sending your data
  useEffect(() => {
    joinEmit()
  }, []);


  const joinEmit = () => {
    if (!isJoined) {
      socket.emit("join", username);
      setIsJoined(true);
    }
    console.log('joining')
  }

  // socket.on for getting users data on join
  useEffect(() => {
    socket.on("users", (newUser) => {
      setUsers((prevUsers) => [...prevUsers, newUser]); // Update users array correctly
    });
  }, []);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  const handleMessageSend = () => {
    if (messageInput.trim() !== "") {
      socket.emit("message", messageInput);
      setMessageInput("");
    }
  };

  return (
    <>
      <div className="rounded w-2/3 flex flex-row mx-auto mt-2 border border-gray-500  ">
        <div className="w-1/4 bg-gray-700 text-white overflow-y-auto flex flex-col">
          <div className="w-full bg-gray-600 text-white h-[50px] flex flex-col justify-center text-lg pl-4 ">
            Users ({users.length})
          </div>
          {users &&
            users?.map((user) => (  
                <div key={user?.socketId} className="w-full bg-slate-400  hover:bg-slate-500  p-2 text-black hover:text-white cursor-pointer transition duration-300">
                  {username === user?.username ? "You" : user?.username}
                </div>
              ))}
        </div>
        <div className="w-3/4 bg-slate-100 flex flex-col">
          {/* room name */}
          <div className="w-full bg-gray-600 text-white h-[50px] flex flex-col justify-center text-lg pl-4">
            {room.length > 0 ? room : "Select a user to talk to"}
          </div>
          {/* chat box */}
          <div className="w-full h-[500px] overflow-y-auto overflow-x-hidden flex flex-col gap-2 px-4 py-3">
            {room.length > 0 && (
              <>
                {/* message right */}
                <div className="w-full flex flex-row-reverse">
                  <div className="flex flex-col gap-[2px] text-right">
                    <span className="bg-white rounded-2xl w-fit px-3 py-1 border border-gray-300 shadow">
                      message 1
                    </span>
                    <small className="text-[10px] pr-2">07/03/2024</small>
                  </div>
                </div>
                {/* message left */}
                <div className="w-full flex">
                  <div className="flex flex-col gap-[2px] text-left">
                    <span className="bg-blue-500 text-white rounded-2xl border border-gray-300 w-fit px-3 py-1 shadow">
                      message 2
                    </span>
                    <small className="text-[10px] pl-2">07/03/2024</small>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex">
            {room.length > 0 && (
              <>
                <input
                  type="text"
                  className="w-full p-2 border-none"
                  placeholder="Enter your message"
                />
                <button
                  type="button"
                  className="w-[100px] bg-blue-500 hover:bg-blue-700 text-white"
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
