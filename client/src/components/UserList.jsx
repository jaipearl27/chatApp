import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io"
import axios from "axios";
import { MagnifyingGlass } from "react-loader-spinner";

const UserList = ({ myChats, setUsers, userName, joinRoom, senderName}) => {
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([])




  useEffect(() => {
    if (searchInput.length <= 0) {
      return;
    }
    setIsLoading(true);
    // debouncing to search for employees 
    const getData = setTimeout(()=> {
      axios
        .get(`${import.meta.env.VITE_API_URL}/employees/employee/${searchInput}`)
        .then((res) => {
          if (res?.data?.status) {
            let filteredUsers = res?.data?.employee?.filter((u) => u?.userName !== userName)
            setSearchedUsers(filteredUsers);
            processActiveUsers(res?.data?.activeUsers)
          }
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    }, 1000)

    return () => clearTimeout(getData)

  }, [searchInput]);

  const joinRoomHandler = (receiverName, roomType, roomTitle) => {
    setSearchInput("")
    joinRoom(receiverName, roomType, roomTitle)
  }

  // processing active user data as per the user data that comes
  // const processActiveUsers = () => {
  //   let currentActiveUsers = activeUsers
  //   let searchedUserData = searchedUsers
  //   currentActiveUsers.forEach((user) => {
  //       searchedUsers.forEach((searchedUser) = > {
  //         if(user?.userName === searchedUser)
  //       })
  //   })
  // }


  return (
    <div 
      className="w-[300px] text-white flex flex-col gap-3"
      style={{borderRight: '1px solid rgb(156, 163, 175) '}}
    >
      {/* search input */}
      <div className="flex flex-col gap-1">
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
        {searchInput.length > 0 && (
          <div className="w-[95%] mx-auto flex flex-col bg-gray-100 shadow-lg transition duration-300 border  border-gray-400 rounded-sm max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="w-full flex justify-center py-1">
                <MagnifyingGlass
                  visible={true}
                  height="40"
                  width="40"
                  ariaLabel="magnifying-glass-loading"
                  wrapperStyle={{}}
                  wrapperClass="magnifying-glass-wrapper"
                  glassColor="#c0efff"
                  color="#023d9d"
                />
              </div>
            ) : (
              <>
                {searchedUsers?.length > 0 ? (
                  searchedUsers?.map((user) => (
                      <div
                        key={user?._id}
                        className="relative flex flex-row gap-2 px-4 py-2 cursor-pointer transition duration-300 even:bg-white odd:bg-gray-100 hover:bg-slate-200"
                        onClick={() => {
                          joinRoomHandler(user?.userName, "oneToOne", [`${user?.firstName} ${user?.lastName}`, `${senderName}`])
                        }
                        }
                      >
                        <div className="h-[30px] w-[30px] md:h-[30px] md:w-[30px] flex flex-col justify-center relative">
                          <img
                            src={`${
                              user?.avatar ? user?.avatar : "/noProfilePic.png"
                            }`}
                            alt="no profile pic"
                            className="w-[100%] h-[100%] rounded-full absolute"
                          />
                          {user?.status ? (
                            <span
                              className={`h-[8px] w-[8px] bg-[#53ff31]
                              border border-[#121212] rounded-full absolute bottom-0 right-0`}
                            ></span>
                          ) : (
                            <span
                              className={`h-[8px] w-[8px] bg-white border border-[#121212] rounded-full absolute bottom-0 right-0`}
                            ></span>
                          )}
                        </div>
                        <div className="text-black flex flex-col justify-center">
                          <div className="font-medium text-[16px]">
                            {user?.firstName + " " + user?.lastName}
                          </div>
                        </div>
                        <IoIosArrowForward className="absolute right-1 text-[#121212]" size={20}/>
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-center py-1 font-medium text-[#494949]">
                      No results
                    </div>
                  )}
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="max-h-[90%] overflow-y-auto">

      </div>
      {myChats &&
        myChats
          ?.filter((u) => u?.userName !== userName)
          ?.map((user) => (
            <div
              key={user?._id}
              className="flex flex-row gap-2 px-4 py-2 cursor-pointer hover:bg-slate-100 transition duration-300"
              // onClick={() => joinRoom(user?.userName)}
            >
              <div className="h-[30px] w-[30px] md:h-[40px] md:w-[40px] flex flex-col justify-center relative">
                <img
                  src={`${user?.avatar ? user?.avatar : "/noProfilePic.png"}`}
                  alt="no profile pic"
                  className="w-[100%] h-[100%] rounded-full absolute"
                />
                <span
                  className={`h-[8px] w-[8px] bg-[#53ff31] rounded-full absolute bottom-0 right-0`}
                ></span>
              </div>
              <div className="text-[#121212] flex flex-col justify-center">
                <div className="font-medium text-[20px]">
                  {user?.firstName + " " + user?.lastName}
                </div>
                {/* most recent message from this user, bold if we haven't read yet */}
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
