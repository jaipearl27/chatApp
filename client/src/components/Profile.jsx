import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";

const Profile = ({ showProfile, setShowProfile }) => {
  console.log(showProfile, "show profile");
  return (
    <div className="w-[500px] flex flex-col ">
      <div className="relative w-full border border-l-0 border-t-0 border-gray-300 text-black min-h-[50px] flex flex-col justify-center text-base py-2 px-4">
        <div className="flex flex-row justify-between gap-2 ">
          <div className="text-black flex flex-col justify-center">
            <div className="font-medium text-black">Profile</div>
          </div>
          <IoCloseOutline
            size={24}
            className="cursor-pointer"
            onClick={() => setShowProfile(null)}
          />
        </div>
      </div>
      <div className="h-[100%] overflow-y-auto">
        <div>
          <div className="flex flex-col justify-center gap-3 mt-2 px-4">
            <div className="w-full flex justify-center">
              <img
                src="/noProfilePic.webp"
                alt="no profile pic"
                className="w-[80%] relative rounded-2xl"
              />
            </div>
            <div className="font-semibold text-xl">{showProfile}</div>
            <div className="flex gap-2 w-full">
              <div className="flex flex-col justify-center">
                <span className="h-[8px] w-[8px] bg-[#53ff31] rounded-full"></span>
              </div>
              <span>Active</span>
            </div>
            <div className="w-full broder border-t border-gray-300 flex flex-col">
              <div className="text-xl font-semibold">Contact Information</div>
              <div className="flex">
                <div className="flex flex-col justify-center rounded-lg w-[50px] h-[50px]">
                  <MdOutlineEmail size={32} className="text-gray-800" />
                </div>
                <div className="flex flex-col justify-center text-lg text-blue-600 hover:text-blue-700 hover:underline transition duration-300">
                  <a href="mailto:saksham@pearlorganisation.com" >saksham@pearlorganisation.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
