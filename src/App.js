import React, { useState } from "react";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Register from "./components/Register";
import SessionList from "./components/SessionList";
import { getCurrentUser, logout } from "./services/auth";
import "./index.css";

const App = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [currentSession, setCurrentSession] = useState(null);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <div className="App container-fluid">
      {!user ? (
        <div className="auth-container">
          <h2 className="text-center">Login</h2>
          <Login setUser={setUser} />
          <h2 className="text-center mt-4">Register</h2>
          <Register />
        </div>
      ) : (
        <div className="main-container">
          <button onClick={handleLogout} className="btn btn-danger mb-3 w-100">
            Logout
          </button>
          <div className="row">
            <div className="col-md-4">
              <SessionList setCurrentSession={setCurrentSession} />
            </div>
            <div className="col-md-8">
              {currentSession ? (
                <Chat currentSession={currentSession} />
              ) : (
                <p className="text-center">
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
