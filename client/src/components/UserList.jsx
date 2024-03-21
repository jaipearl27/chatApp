import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import { MagnifyingGlass } from "react-loader-spinner";

const UserList = ({ myChats, setUsers, userName }) => {
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);

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
            setSearchedUsers(res?.data?.employee);
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

  return (
    <div className="w-2/6 border border-gray-400 text-white overflow-y-auto flex flex-col gap-3">
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
          <div className="w-[95%] mx-auto flex flex-col bg-gray-100 shadow-lg transition duration-300 border border-gray-400 rounded-sm max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <>
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
              </>
            ) : (
              <>
                {searchedUsers?.length > 0 &&
                  searchedUsers
                    ?.filter((u) => u?.userName !== userName)
                    ?.map((user) => (
                      <div
                        key={user?._id}
                        className="flex flex-row gap-2 px-4 py-2 cursor-pointer transition duration-300 even:bg-white odd:bg-gray-100 hover:bg-slate-200"
                        // onClick={() => joinRoom(user?.userName)}
                      >
                        <div className="h-[20px] w-[20px] md:h-[20px] md:w-[20px] flex flex-col justify-center relative">
                          <img
                            src={`${
                              user?.avatar ? user?.avatar : "/noProfilePic.webp"
                            }`}
                            alt="no profile pic"
                            className="w-[100%] h-[100%] rounded-full absolute"
                          />
                          {/* <span
                            className={`h-[6px] w-[6px] bg-[#53ff31] rounded-full absolute bottom-0 right-0`}
                          ></span> */}
                        </div>
                        <div className="text-black flex flex-col justify-center">
                          <div className="font-medium text-[14px]">
                            {user?.firstName + " " + user?.lastName}
                          </div>
                        </div>
                      </div>
                    ))}
              </>
            )}
          </div>
        )}
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
                  src={`${user?.avatar ? user?.avatar : "/noProfilePic.webp"}`}
                  alt="no profile pic"
                  className="w-[100%] h-[100%] rounded-full absolute"
                />
                <span
                  className={`h-[8px] w-[8px] bg-[#53ff31] rounded-full absolute bottom-0 right-0`}
                ></span>
              </div>
              <div className="text-black flex flex-col justify-center">
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
