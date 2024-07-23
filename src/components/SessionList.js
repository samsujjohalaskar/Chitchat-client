import React, { useState, useEffect } from "react";
import { getSessions, addSession } from "../services/db";

const SessionList = ({ setCurrentSession }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const storedSessions = await getSessions();
      setSessions(storedSessions);
      console.log("Fetched sessions:", storedSessions);
    };

    fetchSessions();
  }, []);

  const handleNewSession = async () => {
    console.log("Creating a new session...");
    const newSession = await addSession();
    if (newSession) {
      console.log("New session created:", newSession);
      setSessions((prevSessions) => [...prevSessions, newSession]);
      setCurrentSession(newSession);
    } else {
      console.error("Failed to create a new session.");
    }
  };

  return (
    <div className="session-list">
      <h2 className="text-center">Sessions</h2>
      <button
        onClick={handleNewSession}
        className="btn btn-secondary w-100 mb-3"
      >
        New Session
      </button>
      <ul className="list-group">
        {sessions.map((session) => (
          <li
            key={session.id}
            className="list-group-item"
            onClick={() => setCurrentSession(session)}
          >
            {session.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionList;
