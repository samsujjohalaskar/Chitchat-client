import React, { useState } from "react";
import Chat from "./components/Chat";
import SessionList from "./components/SessionList";
import { getCurrentUser, logout } from "./services/auth";
import "./index.css";
import { FaUserCircle } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import Logo from "./components/Logo";
import Auth from "./components/Auth";

const App = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [currentSession, setCurrentSession] = useState(null);
  const [sideBar, showSideBar] = useState(false);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <div className="flex items-center justify-center bg-slate-200 min-h-dvh">
      {!user ? (
        <Auth setUser={setUser} />
      ) : (
        <div className="max-w-5xl w-full bg-white h-[850px] sm:h-[800px] border-white border-x-2 sm:border-l-0 sm:rounded-2xl">
          <div className="flex w-full">
            <div
              className={`fixed h-dvh top-0 ${
                sideBar ? "left-0" : "-left-60 sm:left-0"
              } bg-slate-800 text-white p-4 min-w-60 transition-all duration-500 flex flex-col justify-between sm:relative sm:rounded-l-2xl sm:h-[800px]`}
            >
              <IoMdClose
                className="absolute right-2 top-2 sm:hidden"
                size={25}
                onClick={() => showSideBar(false)}
              />

              <div>
                <div className="hidden sm:block">
                  <Logo />
                </div>
                <div className="flex flex-col justify-center items-center mt-4">
                  <FaUserCircle size={45} />
                  <p className="text-lg">{user.fullname}</p>
                  <p className="text-sm text-slate-300">{user.username}</p>
                </div>

                <div className="flex flex-col gap-2 mt-3">
                  {[user.phone, user.email].map((item, index) => (
                    <div key={index}>
                      <p className="text-sm text-slate-300">
                        {index === 0 ? "Phone" : "Email"}
                      </p>
                      <p className="text-sm">{item}</p>
                    </div>
                  ))}
                </div>

                <SessionList
                  onSessionClick={() => showSideBar(false)}
                  setCurrentSession={setCurrentSession}
                  currentSession={currentSession}
                />
              </div>

              <button
                onClick={handleLogout}
                className="mt-4 bg-theme w-full rounded-full p-1 hover:opacity-80"
              >
                Logout
              </button>
            </div>
            <div className="flex-1 h-full max-w-full">
              <div className="flex justify-between items-center border-b-[1px] border-slate-200 p-2">
                <div className="sm:hidden">
                  <Logo />
                </div>
                <p className="hidden font-semibold sm:block">Messages</p>
                <MdMenu
                  size={25}
                  className="sm:hidden"
                  onClick={() => showSideBar(true)}
                />
              </div>
              {currentSession ? (
                <Chat currentSession={currentSession} />
              ) : (
                <p className="text-center mt-2">
                  Select or create a session to start chatting.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
