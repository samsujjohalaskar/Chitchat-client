import { openDB } from "idb";

const dbPromise = openDB("chat-db", 2, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("messages")) {
      const messageStore = db.createObjectStore("messages", {
        keyPath: "id",
        autoIncrement: true,
      });
      messageStore.createIndex("sessionId", "sessionId");
    }
    if (!db.objectStoreNames.contains("sessions")) {
      db.createObjectStore("sessions", {
        keyPath: "id",
        autoIncrement: true,
      });
    }
  },
});

export const addMessage = async (sessionId, message) => {
  const db = await dbPromise;
  const tx = db.transaction("messages", "readwrite");
  const store = tx.objectStore("messages");
  await store.add({ sessionId, message, timestamp: new Date() });
  await tx.done;
};

export const getMessagesForSession = async (sessionId) => {
  const db = await dbPromise;
  const tx = db.transaction("messages", "readonly");
  const store = tx.objectStore("messages");
  const index = store.index("sessionId");
  const messages = await index.getAll(sessionId);
  await tx.done;
  return messages;
};

export const addSession = async () => {
  try {
    const db = await dbPromise;
    const session = { name: `Session ${Date.now()}`, timestamp: new Date() };
    const tx = db.transaction("sessions", "readwrite");
    const store = tx.objectStore("sessions");
    const id = await store.add(session);
    await tx.done;
    console.log("Added session to DB:", { ...session, id });
    return { ...session, id };
  } catch (error) {
    console.error("Error adding session:", error);
  }
};

export const getSessions = async () => {
  const db = await dbPromise;
  const tx = db.transaction("sessions", "readonly");
  const store = tx.objectStore("sessions");
  const sessions = await store.getAll();
  await tx.done;
  return sessions;
};
