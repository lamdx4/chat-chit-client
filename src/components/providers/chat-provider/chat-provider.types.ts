import Group from "@/types/group.model";
import Message from "@/types/message.model";
import { Member } from "@/types/member.model";

// Định nghĩa kiểu Action cho reducer
export type ChatAction =
  | { type: "SET_FIRST_LOAD"; payload: boolean }
  | { type: "SET_SELECTED_GROUP_ID"; payload: number | null }
  | { type: "ADD_GROUP"; payload: Group }
  | { type: "ADD_MESSAGE"; payload: { groupId: number; message: Message } }
  | { type: "ADD_MEMBER"; payload: { groupId: number; member: Member } }
  | {
      type: "LOAD_MESSAGES";
      payload: { groupId: number; messages: Message[] };
    };

// Định nghĩa state
export interface ChatState {
  isFirstLoadGroup: boolean;
  groups: Group[];
  selectedGroupId: number | null;
}

// Định nghĩa kiểu Context
export interface ChatContextType {
  isFirstLoadGroup: boolean;
  groups: Group[];
  selectedGroupId: number | null;
  selectGroup: (groupId: number) => void;
  loadMoreMessages: () => Promise<void>;
  hasFirstLoadedMessages: (groupId: number) => boolean;
  sendTextMessage: (
    groupId: number,
    message: string,
    replyMessageId?: number,
    manipulates?: number[]
  ) => Promise<void>;
}
