// import { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import "./App.css";

import ChatRoom from "./components/ChatRoom";

let user = localStorage.getItem('username')

function App() {
  // states
  const [username, setUsername] = useState("");
  const [inRoom, setInRoom] = useState(false);

  useEffect(() => {
    if(user?.length > 0){
      setUsername(user);
      setInRoom(true)
    }
  }, []);

  const enterRoom = () => {
    if (username.length > 0) setInRoom(true);
    localStorage.setItem("username", username);
  };

  if (inRoom) {
    return (
      <>
        <ChatRoom username={username} setUsername={setUsername} />
      </>
    );
  } else {
    return (
      <>
        <div className="w-full flex justify-center mt-2">
          <div className="flex flex-col">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="enter username"
              className="p-3 border border-black rounded "
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 transition duration-300"
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
