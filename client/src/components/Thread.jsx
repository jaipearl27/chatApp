import React from 'react'
import { GrAttachment } from 'react-icons/gr';
import { IoCloseOutline } from 'react-icons/io5';
import AppSvgs from './AppSvgs';
import { BsSend } from 'react-icons/bs';

const Thread = ({replyTo, setReplyTo, handleThreadMessageSend, threadMessageInput, setThreadMessageInput, threadMessageInputRef, threadMessages}) => {
  return (
    <div className="w-[500px] flex flex-col ">
                  <div className="relative w-full border border-l-0 border-t-0 border-gray-300 text-black min-h-[50px] flex flex-col justify-center text-base py-2 px-4">
                    <div className="flex flex-row justify-between gap-2 ">
                      <div className="text-black flex flex-col justify-center">
                        <div className="font-medium text-black">Thread</div>
                      </div>
                      <IoCloseOutline size={24} className="cursor-pointer" onClick={() => setReplyTo(null)} />
                    </div>
                  </div>
                  <div className="h-[90%]">
                    <div>
                    <div className="flex flex-col justify-center">
                          {/* message left */}
                          <div className="w-full flex px-3">
                            <div className="flex flex-col gap-2 text-left relative max-w-[100%]">
                              <small className="text-[10px]">
                                {replyTo?.timestamp}
                              </small>
                              <div className="flex flex-row gap-2 relative">
                                <img
                                  src="/noProfilePic.webp"
                                  alt="no profile pic"
                                  className="w-[25px] h-[25px] rounded-full relative"
                                />

                                <div
                                  className="bg-[#ececff] w-fit max-w-full text-gray-700 border border-gray-300 px-3 py-1 shadow-xs text-wrap break-words h-fit "
                                  style={{ borderRadius: "0 12px 12px 12px" }}
                                >
                                  {replyTo?.message}
                                </div>
                                <div className="flex flex-col justify-center">
                             

                                  <div
                                    className="flex flex-col justify-center rounded-full cursor-pointer hover:scale-110 transition duration-300 w-fit relative"
                                    // onClick={() => selectThreadMessage(idx)}
                                  >
                                    <AppSvgs name="addEmoji" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                  {/* chat input */}
                  <div className="flex gap-2 border-t border-gray-300 p-2">
                    <div className="relative w-full">
                      <div className="absolute right-2 flex flex-col justify-center h-full">
                        <GrAttachment
                    className="text-black"
                    size={20}
                  />
                      </div>

                      <textarea 
                        type="text"
                        className="w-full h-full text-center p-1 pl-2 pr-8 border border-gray-200 bg-[#ececff] rounded-md"
                        placeholder="Enter you reply"
                        value={threadMessageInput}
                        onChange={(e) => setThreadMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleThreadMessageSend;
                          }
                        }}
                        ref={threadMessageInputRef}
                      />
                    </div>
                    <button
                      type="button"
                      className="w-fit p-1 rounded-md bg-[#00116c] hover:bg-[#000b41] text-white"
                      onClick={handleThreadMessageSend}
                    >
                      <BsSend size="40" />
                    </button>
                  </div>
                </div>
  )
}

export default Thread
