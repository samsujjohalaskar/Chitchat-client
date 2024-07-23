import React, { useState, useEffect, useRef } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { addMessage, getMessagesForSession } from "../services/db";
import "bootstrap/dist/css/bootstrap.min.css";

const Chat = ({ currentSession }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const clientRef = useRef(null);

  useEffect(() => {
    const createClient = () => {
      const client = new W3CWebSocket("ws://localhost:8080");
      clientRef.current = client;

      client.onopen = () => {
        console.log("WebSocket Client Connected");
      };

      client.onmessage = (messageEvent) => {
        const newMessage = messageEvent.data;
        console.log("Received message:", newMessage);

        // Ensure the message is saved with the correct session ID
        addMessage(currentSession.id, newMessage)
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

    // Fetch messages for the current session
    const fetchMessages = async () => {
      try {
        const storedMessages = await getMessagesForSession(currentSession.id);
        console.log("Fetched messages for session:", storedMessages);
        setMessages(storedMessages.map((msg) => msg.message));
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

  const sendMessage = () => {
    if (
      clientRef.current &&
      clientRef.current.readyState === W3CWebSocket.OPEN
    ) {
      console.log("Sending message:", message);
      clientRef.current.send(message);
      setMessage("");
    } else {
      console.warn("WebSocket not open, unable to send message.");
    }
  };

  return (
    <div className="chat-container">
      <h1 className="text-center">Chat Session: {currentSession.name}</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            {msg}
          </div>
        ))}
      </div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
