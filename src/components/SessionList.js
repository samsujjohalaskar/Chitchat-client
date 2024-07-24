import React, { useState, useEffect } from "react";
import { getSessions, addSession } from "../services/db";
import { IoCreateOutline } from "react-icons/io5";

const SessionList = ({ setCurrentSession, currentSession, onSessionClick }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const storedSessions = await getSessions();
      setSessions(storedSessions);
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      setCurrentSession(sessions[sessions.length - 1]);
    }
  }, []);

  const handleNewSession = async () => {
    const newSession = await addSession();
    if (newSession) {
      setSessions((prevSessions) => [...prevSessions, newSession]);
      setCurrentSession(newSession);
    } else {
      console.error("Failed to create a new session.");
    }
  };

  return (
    <div className="mt-6">
      <div
        onClick={handleNewSession}
        className="flex justify-between items-center border-slate-600 border-t-[1px] py-4 cursor-pointer"
      >
        <p className="text-sm">New Session</p>
        <IoCreateOutline />
      </div>
      <p className="mt-3 text-sm text-slate-300">
        Past Sessions ({sessions.length})
      </p>
      <ul className="flex flex-col gap-1 mt-2 max-h-80 overflow-y-auto">
        {[...sessions].reverse().map((session) => (
          <li
            key={session.id}
            className={`text-sm cursor-pointer w-full p-1 rounded ${
              currentSession &&
              currentSession.name === session.name &&
              "bg-slate-600"
            }`}
            onClick={() => {
              setCurrentSession(session);
              onSessionClick();
            }}
          >
            {session.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionList;
