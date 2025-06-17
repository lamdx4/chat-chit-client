import { EventEmitter } from "events";
import { initializeSocket } from "@/socketio/socket";
import Group from "@/types/group.model";
import Message from "@/types/message.model";
import { Socket } from "socket.io-client";

class MessageListener extends EventEmitter {
  private static instance: MessageListener;
  private socket: Socket;

  constructor() {
    super();
    this.socket = initializeSocket();
    this.init();
  }
  public static getInstance(): MessageListener {
    if (!MessageListener.instance) {
      MessageListener.instance = new MessageListener();
    }
    return MessageListener.instance;
  }

  private init() {
    this.socket.on("new-message", (msg: Message) => {
      console.log("New message event received: ", msg);
      this.emit("message", msg);
    });
    this.socket.on("typing", (group: Group) => {
      console.log("Typing event received: ", group);
    });
    this.socket.on("change_state_message", () => {});
    this.socket.on("react_message", () => {});
    this.socket.on("pin_message", () => {});
    this.socket.on("del_message", () => {});
    this.socket.on("change_nickname", () => {});
    this.socket.on("update-avatar-group", () => {});
    this.socket.on("recall-message", () => {});
  }
}

export default MessageListener;
