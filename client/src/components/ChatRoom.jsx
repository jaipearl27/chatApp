import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// icons
import { BsSend } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { IoReturnUpBackOutline } from "react-icons/io5";

import UserList from "./UserList";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { IoCloseOutline } from "react-icons/io5";
import AppSvgs from "./AppSvgs";
import Thread from "./Thread";
import Profile from "./Profile";

function ChatRoom({ userName, senderName, setSenderName, setUserName }) {
  // states

  const [socket, setSocket] = useState(null);

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [threadMessages, setThreadMessages] = useState([]);
  const [threadMessageInput, setThreadMessageInput] = useState("");
  const [chatsList, setChatsList] = useState([]);
  const [room, setRoom] = useState("");
  const [roomId, setRoomId] = useState("");

  const [isJoined, setIsJoined] = useState(false); // Track whether join event is emitted

  const [dateOptions, setDateOptions] = useState({
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);

  const [replyTo, setReplyTo] = useState(null);
  const [showProfile, setShowProfile] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);


  const [makeGroup, setMakeGroup] = useState(false);

  // refs
  const messageInputRef = useRef();
  const threadMessageInputRef = useRef();
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
      const handleNewMessage = (data) => {
        console.log(data);
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            new Notification(data.userName, {
              body: data.message,
            });
          }
        });
        setMessages((prevMessages) => [...prevMessages, data]);
      };

      socket.on("newMessage", handleNewMessage);

      socket.on("chatHistory", (data) => {
        setChatsList(data?.chatHistory);
        // console.log(data)
      });

      return () => {
        socket.off("newMessage");
        socket.off("chatHistory");
      };
    }
  }, [socket]);

  const handleMessageSend = () => {
    if (messageInput.length > 0 && socket) {
      socket.emit("message", {
        userId: 1, //sample userId, update with mongoDB id in future
        userName: userName,
        message: messageInput.trim(),
      });
      setMessageInput("");
      messageInputRef.current.focus();
    }
  };

  const handleThreadMessageSend = () => {
    if (messageInput.length > 0 && socket) {
      console.log("emitting thread reply message");
      socket.emit("threadMessage", {
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
    console.log(users);
    let roomName = "";
    users.forEach((e) => {
      roomName += e;
    });
    if (socket) {
      socket.emit(
        "joinRoom",
        { roomTitle, roomName, users, roomType },
        (res) => {
          if (res?.status) {
            console.log(res);
            // fill chat history when joining room
            setMessages(res?.chatHistory?.chats);

            // if room type is oneToOne then roomTitle will be of the other name out of 2 in that array
            if (res?.roomData?.roomType === "oneToOne") {
              let roomTitleArr = res?.roomData?.roomTitle;
              // console.log(roomTitleArr, senderName)
              let idx = roomTitleArr?.findIndex((name) => name === senderName);

              if (idx >= 0) {
                roomTitleArr.splice(idx, 1);
                setRoomId(res?.roomData?.roomName);
                // setUserActivityStatus()
                setRoom(roomTitleArr[0]);
              }
            } else {
              // if roomType is not one to one , then obviously it will be group or comminity in which only admin can enter name of the same, so no issues in using
              res?.roomData?.roomTitle[0];
            }
            // console.log(data?.room)
          } else {
            console.log("user already in the room");
          }
        }
      );
    }
  };

  const removeLocal = () => {
    socket.disconnect();
    window.location.reload();
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
    console.log(userName, senderName);
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

  // const selectMessage = (idx) => {
  //   if (idx === selectedMessageIndex) {
  //     setSelectedMessageIndex(null);
  //     return;
  //   }
  //   setSelectedMessageIndex(idx);
  // };

  return (
    <div>
      {selectedMessageIndex !== null && (
        <div
          className="absolute w-screen h-full z-[1]"
          onClick={() => setSelectedMessageIndex(null)}
        ></div>
      )}
      <button
        className="bg-red-400 px-2 py-1 ml-2 text-white"
        onClick={removeLocal}
      >
        reset user
      </button>
      <div className="w-full text-2xl text-center">
        Current User: {userName}
        <br />
        Current Room : {roomId}
      </div>
      <div
        className={`w-[98%] md:w-[90vw] max-w-[1200px] flex flex-row mx-auto mt-2 border border-gray-300 rounded`}
      >
        <UserList
          chatsList={chatsList}
          setChatsList={setChatsList}
          userName={userName}
          joinRoom={joinRoom}
          senderName={senderName}
          setMakeGroup={setMakeGroup}
        />

        {room?.length > 0 ? (
          <div className={`w-full h-[80vh] bg-white flex flex-row rounded`}>
            {/* other user's name and image */}
            <div className="flex flex-col w-full">
              <div className="relative w-full border border-l-0 border-t-0 border-gray-300 text-black min-h-[50px] max-h-[50px] flex flex-col justify-center text-base pl-4 py-2">
                <div
                  className="flex flex-row gap-2"
                  onClick={() => {
                    setReplyTo(null);
                    setShowProfile(room);
                  }}
                >
                  <div className="h-[40px] w-[40px] flex flex-col justify-center relative">
                    <img
                      src="/noProfilePic.png"
                      alt="no profile pic"
                      className="w-[100%] h-[100%] rounded-full absolute"
                    />
                    <span className="h-[8px] w-[8px] bg-[#53ff31] rounded-full absolute bottom-0 right-0"></span>
                  </div>
                  <div className="text-black flex flex-col justify-center">
                    <div className="font-medium text-black">{room}</div>
                    <div className="text-xs font-light">Available</div>
                  </div>
                </div>

                {selectedMessageIndex !== null && (
                  <div className="absolute w-[280px] z- [99] top-full right-[20%] lg:right-[20%] 2xl:right-[50%]  ">
                    <Picker data={data} onEmojiSelect={console.log} />
                  </div>
                )}
              </div>

              {/* chat box */}
              <div
                className="relative w-full h-[90%] max-h-[90%] overflow-y-auto overflow-x-hidden flex flex-col gap-6 md:gap-2 px-2 py-6 border-r border-gray-300"
                ref={chatBoxRef}
              >
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
                                  style={{ borderRadius: "12px 12px 0 12px" }}
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
                                  className="bg-[#ececff] text-gray-700 border border-gray-300 px-3 py-1 shadow-xs text-wrap break-words h-fit"
                                  style={{ borderRadius: "0 12px 12px 12px" }}
                                >
                                  {message?.message}
                                </div>
                                <div className="flex flex-col">
                                  {/* reply */}
                                  <div
                                    className="flex flex-col justify-center rounded-full cursor-pointer hover:scale-110 transition duration-300 w-fit"
                                    title="Reply"
                                    onClick={() => {
                                      setReplyTo(message);
                                      setShowProfile(null);
                                    }}
                                  >
                                    <IoReturnUpBackOutline size={18} />
                                  </div>

                                  <div
                                    className="flex flex-col justify-center rounded-full cursor-pointer hover:scale-110 transition duration-300 w-fit relative"
                                    onClick={() => selectMessage(idx)}
                                    title="React with emoji"
                                  >
                                    <AppSvgs name="addEmoji" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              {/* chat input */}
              <div className="flex gap-2 border-t border-gray-300 p-2 max-h-[300px]">
                <div className="w-full h-full">
                  <div className="relative flex flex-row border border-gray-200 bg-[#ececff] h-full">
                    <textarea
                      type="text"
                      className="w-[90%] h-auto max-h-[300px] text-center p-1 bg-[#ececff] rounded-md"
                      placeholder="Enter your message"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleMessageSend;
                        }
                      }}
                      ref={messageInputRef}
                    />
                    <div className="flex gap-1 w-[10%] justify-around">
                      <div className="flex flex-col justify-center h-full">
                        <AppSvgs name="addEmoji" />
                      </div>
                      <div className="flex flex-col justify-center h-full">
                        <GrAttachment
                          className="text-black z-[1] cursor-pointer"
                          size={20}
                          onClick={(e) => {
                            e.stopPropagation;
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-fit p-1 rounded-md bg-[#00116c] hover:bg-[#000b41] text-white"
                  onClick={handleMessageSend}
                >
                  <BsSend size="40" />
                </button>
              </div>
            </div>

            {/* chat thread */}
            {replyTo && (
              <Thread
                replyTo={replyTo}
                setReplyTo={setReplyTo}
                handleThreadMessageSend={handleThreadMessageSend}
                threadMessageInput={threadMessageInput}
                setThreadMessageInput={setThreadMessageInput}
                threadMessageInputRef={threadMessageInputRef}
                threadMessages={threadMessages}
              />
            )}

            {/* chat thread */}
            {showProfile && (
              <Profile
                showProfile={showProfile}
                setShowProfile={setShowProfile}
              />
            )}
          </div>
        ) : (
          <div className="w-full h-[80vh] bg-white flex flex-col justify-center text-center text-2xl font-medium rounded">
            Select a user to talk to start chatting
          </div>
        )}
      </div>
      {showCreateGroup && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-md w-[300px] flex flex-col gap-1 p-3">
          <IoCloseOutline size={24} className="cursor-pointer" onClick={() => setShowCreateGroup(false)} />
        </div>
      )}
    </div>
  );
}

export default ChatRoom;
