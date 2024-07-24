import React, { useState, useEffect, useRef } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { addMessage, getMessagesForSession } from "../services/db";
import { IoMdSend } from "react-icons/io";

const Chat = ({ currentSession }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const clientRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const createClient = () => {
      const client = new W3CWebSocket("ws://chitchatws.onrender.com");
      clientRef.current = client;

      client.onopen = () => {
        console.log("WebSocket Client Connected");
      };

      client.onmessage = (messageEvent) => {
        const data = JSON.parse(messageEvent.data);
        const newMessage = {
          content: data.content,
          sender: "server",
          timestamp: new Date(),
          sessionId: data.sessionId,
        };

        addMessage(data.sessionId, newMessage)
          .then(() => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          })
          .catch((error) => {
            console.error("Error saving message:", error);
          });
      };

      client.onerror = (error) => {
        console.error("WebSocket error", error);
      };

      client.onclose = () => {
        console.log("WebSocket Client Disconnected. Reconnecting...");
        setTimeout(createClient, 3000);
      };
    };

    if (clientRef.current) {
      clientRef.current.close();
    }

    createClient();

    const fetchMessages = async () => {
      try {
        const storedMessages = await getMessagesForSession(currentSession.id);
        setMessages(storedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    return () => {
      if (clientRef.current) {
        clientRef.current.close();
      }
    };
  }, [currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (
      clientRef.current &&
      clientRef.current.readyState === W3CWebSocket.OPEN
    ) {
      const newMessage = {
        content: message,
        sender: "user",
        timestamp: new Date(),
        sessionId: currentSession.id,
      };
      clientRef.current.send(JSON.stringify(newMessage));

      addMessage(currentSession.id, newMessage)
        .then(() => {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        })
        .catch((error) => {
          console.error("Error saving message:", error);
        });

      setMessage("");
    } else {
      console.warn("WebSocket not open, unable to send message.");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const date = new Date(message.timestamp).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-screen sm:h-full">
      <div className="flex justify-between items-center p-2 bg-white shadow-md z-10 fixed top-14 border-t-[1px] border-slate-200 left-0 right-0 sm:shadow-none sm:bg-transparent sm:top-0 sm:relative sm:gap-1">
        <p>Session: {currentSession && currentSession.name}</p>
        <p className="text-sm text-slate-500">
          {currentSession && formatDate(currentSession.timestamp)}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pt-24 mt-2 bg-slate-200 sm:flex sm:flex-col sm:flex-none sm:pt-0 sm:mt-0 sm:h-[660px]">
        {Object.keys(groupedMessages).map((date, index) => (
          <div key={index} className="mt-2">
            <div className="text-center mb-4 text-sm text-slate-500">
              {formatDate(date)}
            </div>
            {groupedMessages[date].map((msg, msgIndex) =>
              msg.sender === "user" ? (
                <div key={msgIndex} className="flex justify-end mb-2">
                  <div className="bg-theme text-white p-2 rounded-xl rounded-br-none max-w-xs">
                    <p>{msg.content}</p>
                    <p className="text-xs text-gray-200 float-right">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ) : (
                <div key={msgIndex} className="flex justify-start mb-2">
                  <div className="bg-white text-black p-2 rounded-xl rounded-bl-none max-w-xs">
                    <p>{msg.content}</p>
                    <span className="text-xs text-gray-500 float-right">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center p-2 bg-white shadow-md fixed bottom-0 left-0 right-0 gap-2 sm:shadow-none sm:relative sm:rounded-b-2xl">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          className="flex justify-center items-center text-slate-800 bg-theme p-2 rounded-full h-10 w-10"
          onClick={sendMessage}
        >
          <IoMdSend size={25} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
