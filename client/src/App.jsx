// import { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import "./App.css";

import ChatRoom from "./components/ChatRoom";

let user = localStorage.getItem('userName')

function App() {
  // states
  const [userName, setUserName] = useState("");
  const [inRoom, setInRoom] = useState(false);

  useEffect(() => {
    if(user?.length > 0){
      setUserName(user);
      setInRoom(true)
    }
  }, []);

  const enterRoom = () => {
    if (userName.length > 0) setInRoom(true);
    localStorage.setItem("userName", userName);
  };

  if (inRoom) {
    return (
      <>
        <ChatRoom userName={userName} setUserName={setUserName} />
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
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700  text-white p-2 rounded  transition duration-300"
              onClick={enterRoom}
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
