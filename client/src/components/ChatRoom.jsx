import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BsSend } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";

import UserList from "./UserList";

const socket = io(import.meta.env.VITE_SOCKET_ONETOONE);

function ChatRoom({ userName, setUserName }) {
  // states
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState("");
  const [isJoined, setIsJoined] = useState(false); // Track whether join event is emitted

  const [dateOptions, setDateOptions] = useState({
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // refs
  const messageInputRef = useRef();

  // emit for joining and sending your data
  useEffect(() => {
    joinEmit();
    console.log("user joined:", userName);
  }, [userName]);

  // user joining emit on page load
  const joinEmit = () => {
    if (!isJoined) {
      socket.emit("join", userName);
      setIsJoined(true);
      // setRoom(userName);
    }
  };

  const leaveEmit = () => {
    if (isJoined) {
      socket.emit("leaving", userName);
      setIsJoined(false);
    }
  };

  // socket.on for getting users data on join
  socket.on("users", (users) => {
    setUsers(users);
  });

  // socket.on for receiving messages
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
    if (messageInput.length > 0) {
      socket.emit("message", {
        userName: userName,
        message: messageInput.trim(),
      });
      setMessageInput("");
      messageInputRef.current.focus();
    }
  };

  const joinRoom = (receiverName, roomType, roomTitle) => { 
    
    let users = [userName, receiverName].sort()
    let roomName = "";
    users.forEach((e) => {
      roomName += e
    })
    console.log(`joining ${roomName} `);
    socket.emit("joinRoom", {roomTitle, roomName,users, roomType}, (data) => {
      if (data?.status) {
        // if room type is oneToOne then roomTitle will be of the other name out of 2 in that array
        if(data?.room?.roomType === 'oneToOne'){
          let roomTitleArr = data?.room?.roomTitle
          console.log(roomTitleArr)
          let idx = roomTitleArr?.findIndex((name) => name === userName)
          if(idx >= 0){
            roomTitleArr.slice(idx, 1)
            setRoom(roomTitleArr[0]);
          } 
        } else {
          // if roomType is not one to one , then obviously it will be group or comminity in which only admin can enter name of the same, so no issues in using 
          data?.room?.roomTitle[0]
        }
        console.log(data?.room)
      } else {
        console.log("user already in the room");
      }
    });
    // console.log('emitting Join Room')
  };

  const removeLocal = () => {
    localStorage.removeItem("userName");
    setUserName("");
    window.location.href = "/";
  };

  return (
    <>
      <button className="bg-red-400 px-2 py-1 rounded ml-2 text-white" onClick={removeLocal}>remove user</button>
      <div className="w-full text-2xl text-center">Current User: {userName}</div>
      <div
        className={` w-[98%] md:w-[800px] flex flex-row mx-auto mt-2 border border-gray-400 rounded-lg`}
      >
        <UserList users={users} setUsers={setUsers} userName={userName} joinRoom={joinRoom} />

        {room?.length > 0 ? (
          <div className={`w-4/6 h-[80vh] bg-white flex flex-col rounded-lg`}>
            {/* other user's name and image */}
            <div className="w-full border border-x-0 border-y-1 border-gray-300 text-black min-h-[50px] flex flex-col justify-center text-lg pl-4 py-2">
              <div className="flex flex-row gap-2 ">
                <div className="h-[40px] w-[40px] flex flex-col justify-center relative">
                  <img
                    src="/noProfilePic.webp"
                    alt="no profile pic"
                    className="w-[100%] h-[100%] rounded-full absolute"
                  />
                  <span className="h-[8px] w-[8px] bg-[#53ff31] rounded-full absolute bottom-0 right-0"></span>
                </div>
                <div className="text-black flex flex-col justify-center">
                  <div className="font-medium text-[20px]">{room}</div>
                  <div className="text-xs font-[8px]">Available</div>
                </div>
              </div>
            </div>

            {/* chat box */}
            <div className="w-full h-[90%] max-h-[90%] overflow-y-auto overflow-x-hidden flex flex-col gap-6 md:gap-2 px-2 py-6">
              {/* if room is joined then show chats */}
              {messages &&
                messages?.map((message, idx) => (
                  <div key={idx}>
                    {message?.userName == userName ? (
                      <>
                        {/* message right */}
                        <div className="w-full flex flex-row justify-end ">
                          <div className="flex flex-col text-right relative w-fit max-w-[80%] text-sm md:text-base">
                            <small className="text-[10px] pr-1">
                              16/03/2024
                            </small>
                            <div>
                              <div
                                className="bg-[#00116c]
                              text-white px-3 py-2 shadow-xs text-x` "
                                style={{ borderRadius: "5px 5px 0 5px" }}
                              >
                                {message?.message}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col justify-center">
                        {/* message left */}
                        <div className="w-full flex px-3">
                          <div className="flex flex-row gap-1 text-sm md:text-base">
                            <div className="h-full">
                              <img
                                src="/noProfilePic.webp"
                                alt="no profile pic"
                                className="w-[30px] h-[30px] rounded-full relative"
                              />
                            </div>
                            <div className="flex flex-col text-left relative max-w-[80%]">
                              <small className="text-[10px] absolute -top-5">
                                16/03/2024
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
                      </div>
                    )}
                  </div>
                ))}
            </div>
            {/* chat input */}
            <div className="flex gap-2 border border-y-1 border-gray-400 p-2">
              <button
                type="button"
                className="w-fit p-1 rounded-md text-white"
                // onClick={handleMessageSend}
              >
                <GrAttachment className="text-black" size={30} />
              </button>
              <input
                type="text"
                className="w-full text-center p-1 border border-gray-200 bg-[#ececff] rounded-md"
                placeholder="Type something here"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                ref={messageInputRef}
              />
              <button
                type="button"
                className="w-fit p-1 rounded-md bg-[#00116c] hover:bg-[#000b41] text-white"
                onClick={handleMessageSend}
              >
                <BsSend size="40" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-4/6 h-[80vh] bg-white flex flex-col justify-center text-center text-2xl font-medium rounded-lg">
            Select a user to talk to start chatting
          </div>
        )}
      </div>
    </>
  );
}

export default ChatRoom;
