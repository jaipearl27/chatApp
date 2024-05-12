// import { useEffect, useState } from "react";
import {  useLayoutEffect, useState } from "react";
import "./App.css";

import ChatRoom from "./components/ChatRoom";

const user = JSON.parse(localStorage.getItem('user'))

function App() {
  // states
  const [userName, setUserName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [inRoom, setInRoom] = useState(false);

  useLayoutEffect(() => {

    if(user){
      setUserName(user.userName);
      setSenderName(user.senderName)
      setInRoom(true)
    }
  }, []);

  const enterRoom = () => {
    if (userName.length > 0) setInRoom(true);
    let data = {userName, senderName}
    localStorage.setItem("user", JSON.stringify(data));
  };

  if (inRoom) {
    return (
      <>
        <ChatRoom userName={userName} senderName={senderName} setSenderName={setSenderName} setUserName={setUserName} />
      </>
    );
  } else {
    return (
      <>
        <div className="w-full flex justify-center mt-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="userName">Enter userName</label>
            <input
              type="text"
              placeholder="enter userName"
              className="p-3 border border-black rounded "
              onChange={(e) => setUserName(e.target.value)}
            />
            <label htmlFor="userName">Enter Full Name</label>

            <input
              type="text"
              placeholder="enter full name"
              className="p-3 border border-black rounded "
              onChange={(e) => setSenderName(e.target.value)}
            />
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700  text-white p-2 rounded  transition duration-300"
              onClick={() => {
                if(userName.length > 0 && senderName.length > 0){
                  enterRoom()
                } else {
                  alert('enter all fields bro')
                }
              }}
            >
              Enter Chat
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default App;
