import * as signalR from "@microsoft/signalr";
import { toast } from "sonner";

let connection: signalR.HubConnection | null = null;

export function initializeSocket(): signalR.HubConnection {
  if (!connection)
    connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:57679/io/chat", {
        withCredentials: true,
        accessTokenFactory: () => {
          const token = localStorage.getItem("accessToken");
          if (token) {
            return token;
          }
          throw new Error("No access token found");
        },
      })
      .configureLogging(signalR.LogLevel.Debug)
      .withAutomaticReconnect()
      .build();
  connection
    .start()
    .then(() => {
      console.log("[SignalR] Connection started");
    })
    .catch((error) => {
      console.error("[SignalR] Error starting connection", error);
      toast("Error starting connection socket")
    });

  connection.onclose((error) => {
    console.error("[SignalR] Connection closed", error);
  });
  connection.onreconnected((connectionId) => {
    console.log("[SignalR] Reconnected", connectionId);
  });
  connection.onreconnecting((error) => {
    console.warn("[SignalR] Reconnecting...", error);
  });

  return connection;
}

export function getSocket(): signalR.HubConnection | null {
  return connection;
}
