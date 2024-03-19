import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";

const UserList = ({ users, setUsers, userName }) => {
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if(searchInput.length <= 0){
        return
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/employees/employee/${searchInput}`)
      .then((res) => {
        if(res?.data?.status){
            setUsers(res?.data?.employee)
        }
      }).catch((err)=> console.log(err));
      
  }, [searchInput]);

  return (
    <div className="w-2/6 border border-gray-400 text-white overflow-y-auto flex flex-col gap-3">
      {/* search input */}
      <div className="w-full flex flex-col justify-center relative p-2">
        <input
          type="text"
          placeholder="Search for users "
          className="rounded-full px-3 py-1 border border-gray-400 text-black"
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
        <IoSearchOutline
          className="absolute z-[999] right-4 text-black"
          size={20}
        />
      </div>
      {users &&
        users
          ?.filter((u) => u?.userName !== userName)
          ?.map((user) => (
            <div
              key={user?._id}
              className="flex flex-row gap-2 px-4 py-2 cursor-pointer hover:bg-slate-100 transition duration-300"
              onClick={() => joinRoom(user?.userName)}
            >
              <div className="h-[30px] w-[30px] md:h-[40px] md:w-[40px] flex flex-col justify-center relative">
                <img
                  src="/noProfilePic.webp"
                  alt="no profile pic"
                  className="w-[100%] h-[100%] rounded-full absolute"
                />
                <span className="h-[8px] w-[8px] bg-[#53ff31] rounded-full absolute bottom-0 right-0"></span>
              </div>
              <div className="text-black flex flex-col justify-center">
                <div className="font-medium text-[20px]">{user?.firstName + " " + user?.lastName}</div>
                <div className="text-xs font-[8px]">
                  Sample last message in this chat...
                </div>
              </div>
            </div>
          ))}
    </div>
  );
};

export default UserList;
