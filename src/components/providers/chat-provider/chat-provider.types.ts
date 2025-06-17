import Group from "@/types/group.model";
import Message from "@/types/message.model";
import { Member } from "@/types/member.model";

// Định nghĩa kiểu Action cho reducer
export type ChatAction =
  | { type: "SET_STATE_LOADING"; payload: boolean }
  | { type: "SET_SELECTED_GROUP_ID"; payload: number | null }
  | {
      type: "ADD_GROUP";
      payload: Group;
    }
  | {
      type: "ADD_GROUPS";
      payload: {
        groups: Group[];
        isHasMore: boolean;
        nextCursor: number;
      };
    }
  | { type: "ADD_MESSAGE"; payload: { groupId: number; message: Message } }
  | { type: "ADD_MEMBER"; payload: { groupId: number; member: Member } }
  | {
      type: "LOAD_MESSAGES";
      payload: { groupId: number; messages: Message[] };
    };

// Định nghĩa state
export interface ChatState {
  isLoadingGroup: boolean;
  groups: Group[];
  selectedGroupId: number | null;
  statusGroupPagination: StatusGroupDataPag;
}

export interface StatusGroupDataPag {
  isHasMore: boolean;
  nextCursor: number;
}

// Định nghĩa kiểu Context
export interface ChatContextType {
  isLoadingGroup: boolean;
  groups: Group[];
  selectedGroupId: number | null;
  selectGroup: (groupId: number) => void;
  loadMoreMessages: () => Promise<void>;
  loadMoreGroups: () => Promise<void>;
  hasFirstLoadedMessages: (groupId: number) => boolean;
  statusGroupPagination: StatusGroupDataPag;
}
