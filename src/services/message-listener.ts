import { EventEmitter } from "events";
import { initializeSocket } from "@/socketio/socket";
import Group from "@/types/group.model";
import Message from "@/types/message.model";
import { Socket } from "socket.io-client";
import transformDateFields from "@/utils/transform-date-field";

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

  // Wrapper method để auto-transform data
  private onWithTransform<T>(event: string, callback: (data: T) => void) {
    this.socket.on(event, (data: T) => {
      const transformedData = transformDateFields(data) as T;
      callback(transformedData);
    });
  }

  private init() {
    // Các events cần transform datetime
    this.onWithTransform<Message>("new-message", (msg) => {
      this.emit("new-message", msg);
    });

    this.onWithTransform<Message>("react-message", (msg) => {
      this.emit("react-message", msg);
    });

    this.socket.on(
      "change-emoji-avatar",
      (data: { groupId: number; emoji: string }) => {
        this.emit("change-emoji-avatar", data);
      }
    );

    this.onWithTransform<Group>("new-group", (group) => {
      this.emit("new-group", group);
    });

    this.onWithTransform<Message>("member-vote-poll", (message) => {
      this.emit("member-vote-poll", message);
    });

    this.onWithTransform<Group>("typing", (group) => {
      console.log("Typing event received: ", group);
    });

    this.onWithTransform<Group>("stop-typing", (group) => {
      console.log("Stop typing event received: ", group);
    });

    // Các events không cần transform (chỉ có primitive data)
    this.socket.on(
      "rename-group",
      (data: { groupId: number; name: string }) => {
        this.emit("rename-group", data);
      }
    );

    this.socket.on(
      "change-avatar-group",
      (data: { groupId: number; avatar: string }) => {
        this.emit("change-avatar-group", data);
      }
    );

    // Empty handlers - không cần transform
    this.socket.on("change_state_message", () => {});
    this.socket.on("react_message", () => {});
    this.socket.on("pin_message", () => {});
    this.socket.on("change_nickname", () => {});
    this.socket.on("recall-message", () => {});
  }
}

export default MessageListener;
