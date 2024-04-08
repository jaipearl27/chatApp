import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// icons
import { BsSend } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { FaRegThumbsUp } from "react-icons/fa";

import UserList from "./UserList";

import EmojiPicker from "emoji-picker-react";

function ChatRoom({ userName, senderName, setUserName }) {
  // states

  const [socket, setSocket] = useState(null);

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState("");
  const [roomId, setRoomId] = useState("");

  const [isJoined, setIsJoined] = useState(false); // Track whether join event is emitted

  const [dateOptions, setDateOptions] = useState({
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);

  // refs
  const messageInputRef = useRef();
  const chatBoxRef = useRef();

  // user joining emit on page load
  const joinEmit = () => {
    if (!isJoined && socket) {
      socket.emit("join", userName);
      setIsJoined(true);
      // setRoom(userName);
    }
  };

  const leaveEmit = () => {
    if (isJoined && socket) {
      socket.emit("leaving", userName);
      setIsJoined(false);
    }
  };

  useEffect(() => {
    if (socket === null) {
      setSocket(io(import.meta.env.VITE_SOCKET_ONETOONE));
    }
    if (socket) {
      socket.on("users", (users) => {
        setUsers(users);
      });

      const handleNewMessage = (data) => {
        console.log(messages);
        console.log("new message", data?.messageData);
        setMessages((prevMessages) => [...prevMessages, data?.messageData]);
      };

      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  }, [socket]);

  const handleMessageSend = () => {
    if (messageInput.length > 0 && socket) {
      console.log("emitting message");
      socket.emit("message", {
        userId: 1, //sample userId, update with mongoDB id in future
        userName: userName,
        message: messageInput.trim(),
      });
      setMessageInput("");
      messageInputRef.current.focus();
    }
  };

  const joinRoom = (receiverName, roomType, roomTitle) => {
    let users = [userName, receiverName].sort();
    let roomName = "";
    users.forEach((e) => {
      roomName += e;
    });
    if (socket) {
      socket.emit(
        "joinRoom",
        { roomTitle, roomName, users, roomType },
        (res) => {
          console.log(res?.roomData?.chatData?.chatHistory[0]);
          if (res?.status) {
            // fill chat history when joining room

            setMessages(res?.roomData?.chatData?.chatHistory);

            // if room type is oneToOne then roomTitle will be of the other name out of 2 in that array
            if (res?.roomData?.room?.roomType === "oneToOne") {
              let roomTitleArr = res?.roomData?.room?.roomTitle;
              // console.log(roomTitleArr)
              let idx = roomTitleArr?.findIndex((name) => name === senderName);
              // i am finding idx to be equal to 0 in one case but it is not slicing down
              if (idx >= 0) {
                roomTitleArr.splice(idx, 1);
                setRoomId(res?.roomData?.room?.roomName);
                setRoom(roomTitleArr[0]);
              }
            } else {
              // if roomType is not one to one , then obviously it will be group or comminity in which only admin can enter name of the same, so no issues in using
              res?.roomData?.room?.roomTitle[0];
            }
            // console.log(data?.room)
          } else {
            console.log("user already in the room");
          }
        }
      );
    }
    // console.log('emitting Join Room')
  };

  const removeLocal = () => {
    localStorage.removeItem("userName");
    setUserName("");
    window.location.href = "/";
    socket.emit("disconnect");
  };

  // socket.on for receiving messages
  useEffect(() => {
    if (socket) {
      socket.on("messages", (messages) => {
        setMessages(messages);
      });
    }
  }, [socket]);

  // emit for joining and sending your data
  useEffect(() => {
    joinEmit();
    // console.log("user joined:", userName);
  }, [userName, socket]);

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages, chatBoxRef]);

  const selectMessage = (idx) => {
    if (idx === selectedMessageIndex) {
      setSelectedMessageIndex(null);
      return;
    }
    setSelectedMessageIndex(idx);
  };

  return (
    <div>
      <button
        className="bg-red-400 px-2 py-1 rounded ml-2 text-white"
        onClick={removeLocal}
      >
        remove user
      </button>
      <div className="w-full text-2xl text-center">
        Current User: {userName}
        <br />
        Current Room : {roomId}
      </div>
      <div
        className={`w-[98%] md:w-[800px] flex flex-row mx-auto mt-2 border border-gray-400 rounded-lg`}
      >
        <UserList
          users={users}
          setUsers={setUsers}
          userName={userName}
          joinRoom={joinRoom}
          senderName={senderName}
        />

        {room?.length > 0 ? (
          <div className={`w-4/6 h-[80vh] bg-white flex flex-col rounded-lg`}>
            {/* other user's name and image */}
            <div className="w-full border border-x-0 border-y-1 border-gray-300 text-black min-h-[50px] flex flex-col justify-center text-lg pl-4 py-2">
              <div className="flex flex-row gap-2 ">
                <div className="h-[40px] w-[40px] flex flex-col justify-center relative">
                  <img
                    src="/noProfilePic.png"
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
            <div
              className="relative w-full h-[90%] max-h-[90%] overflow-y-auto overflow-x-hidden flex flex-col gap-6 md:gap-2 px-2 py-6"
              ref={chatBoxRef}
            >
              {/*  emoji backdrop*/}
              {selectedMessageIndex !== null && (
                <div
                  className="absolute w-full h-full z-[1]"
                  onClick={() => setSelectedMessageIndex(null)}
                ></div>
              )}

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
                              {message?.timestamp}
                            </small>
                            <div className="flex flex-row gap-2 justify-end">
                              <div
                                className="bg-[#00116c]
                              text-white px-3 py-2 shadow-xs text-x` "
                                style={{ borderRadius: "5px 5px 0 5px" }}
                              >
                                {message?.message}
                              </div>
                            </div>
                            {/* <div className="px-1 flex justify-end">
                              <div className="flex flex-col justify-center rounded-full cursor-pointer hover:scale-110 transition duration-300 w-fit">
                                <IoReturnUpBackOutline size={22} />
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col justify-center">
                        {/* message left */}
                        <div className="w-full flex px-3">
                          <div className="flex flex-col gap-2 text-left relative max-w-[80%]">
                            <small className="text-[10px]">
                              {message?.timestamp}
                            </small>
                            <div className="flex flex-row gap-2 relative">
                              <img
                                src="/noProfilePic.webp"
                                alt="no profile pic"
                                className="w-[25px] h-[25px] rounded-full relative"
                              />

                              <div
                                className="bg-[#ececff] text-gray-700 border px-3 py-1 shadow-xs text-wrap break-words h-fit"
                                style={{ borderRadius: "5px 5px 5px 0" }}
                              >
                                {message?.message}
                              </div>
                              <div className="flex flex-col">
                                <div className="flex flex-col justify-center rounded-full cursor-pointer hover:scale-110 transition duration-300 w-fit">
                                  <IoReturnUpBackOutline size={18} />
                                </div>

                                <div
                                  className="flex flex-col justify-center rounded-full cursor-pointer hover:scale-110 transition duration-300 w-fit relative"
                                  onClick={() => selectMessage(idx)}
                                >
                                  <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M15.4286 7.71429C15.4286 3.4538 11.9748 0 7.71429 0C3.4538 0 0 3.4538 0 7.71429C0 11.9748 3.4538 15.4286 7.71429 15.4286C7.82378 15.4286 7.93273 15.4263 8.0411 15.4218C7.89769 15.0144 7.79859 14.5862 7.74959 14.1427L7.71429 14.1429C4.16389 14.1429 1.28571 11.2647 1.28571 7.71429C1.28571 4.16389 4.16389 1.28571 7.71429 1.28571C11.2647 1.28571 14.1429 4.16389 14.1429 7.71429L14.1427 7.74959C14.5862 7.79859 15.0144 7.89769 15.4218 8.0411C15.4263 7.93273 15.4286 7.82378 15.4286 7.71429Z"
                                      fill="#212121"
                                    />
                                    <path
                                      d="M7.85816 12.212C7.96573 11.7388 8.13132 11.2876 8.34705 10.8664C8.14248 10.9072 7.93089 10.9286 7.71427 10.9286C6.76237 10.9286 5.90777 10.5156 5.31829 9.85698C5.0815 9.59243 4.6751 9.56992 4.41054 9.8067C4.14599 10.0435 4.12348 10.4499 4.36026 10.7145C5.18332 11.634 6.38146 12.2143 7.71427 12.2143C7.76241 12.2143 7.81038 12.2135 7.85816 12.212Z"
                                      fill="#212121"
                                    />
                                    <path
                                      d="M6.42857 6.42856C6.42857 6.96112 5.99684 7.39285 5.46429 7.39285C4.93173 7.39285 4.5 6.96112 4.5 6.42856C4.5 5.89601 4.93173 5.46428 5.46429 5.46428C5.99684 5.46428 6.42857 5.89601 6.42857 6.42856Z"
                                      fill="#212121"
                                    />
                                    <path
                                      d="M9.96429 7.39285C10.4968 7.39285 10.9286 6.96112 10.9286 6.42856C10.9286 5.89601 10.4968 5.46428 9.96429 5.46428C9.43173 5.46428 9 5.89601 9 6.42856C9 6.96112 9.43173 7.39285 9.96429 7.39285Z"
                                      fill="#212121"
                                    />
                                    <path
                                      d="M18 13.5C18 15.9853 15.9853 18 13.5 18C11.0147 18 9 15.9853 9 13.5C9 11.0147 11.0147 9 13.5 9C15.9853 9 18 11.0147 18 13.5ZM14.1429 10.9286C14.1429 10.5735 13.855 10.2857 13.5 10.2857C13.145 10.2857 12.8571 10.5735 12.8571 10.9286V12.8571H10.9286C10.5735 12.8571 10.2857 13.145 10.2857 13.5C10.2857 13.855 10.5735 14.1429 10.9286 14.1429H12.8571V16.0714C12.8571 16.4264 13.145 16.7143 13.5 16.7143C13.855 16.7143 14.1429 16.4264 14.1429 16.0714V14.1429H16.0714C16.4264 14.1429 16.7143 13.855 16.7143 13.5C16.7143 13.145 16.4264 12.8571 16.0714 12.8571H14.1429V10.9286Z"
                                      fill="#212121"
                                    />
                                  </svg>
                                </div>
                              </div>

                              {selectedMessageIndex === idx && (
                                <div className="absolute w-[280px] z-[3] top-full">
                                  <EmojiPicker
                                    width="100%"
                                    height="350px"
                                    reactionsDefaultOpen={true}
                                    onEmojiClick={(e) => console.log(e)}
                                    emojiStyle="google"
                                  />
                                </div>
                              )}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleMessageSend;
                  }
                }}
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
    </div>
  );
}

export default ChatRoom;
