import { io, Socket } from "socket.io-client";

let connection: Socket | null = null;

export function initializeSocket() {
  if (!connection)
    connection = io(import.meta.env.VITE_URL_BACKEND + "/", {
      autoConnect: true,
      reconnectionAttempts: 5,
      auth: (cb) => {
        const authorization = "Bearer " + localStorage.getItem("accessToken");
        if (authorization) {
          cb({ authorization });
        } else {
          cb({ authorization: null });
        }
      },
      reconnectionDelay: 1000,
      timeout: 20000,
    });

  connection.on("disconnect", (reason, details) => {
    console.error("[Socket.IO] Disconnected:", reason, details);
  });
  connection.on("connect", () => {
    console.log("[Socket.IO] Connected");
  });
  connection.on("connect_error", (error) => {
    console.log("[Socket.IO] Error when try to connect:", error);
  });
  connection.on("reconnect_attempt", () => {
    console.warn("[Socket.IO] Reconnecting attempt");
  });

  return connection;
}

export function getSocket() {
  return connection;
}
