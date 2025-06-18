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
      type: "ADD_NEW_GROUP";
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
    }
  | {
      type: "ADD_MESSAGE_TO_EXISTING_GROUP";
      payload: { groupId: number; message: Message };
    }
  | {
      type: "CHANGE_GROUP_NAME";
      payload: { groupId: number; name: string };
    }
  | {
      type: "UPDATE_GROUP_AVATAR";
      payload: { groupId: number; avatar: string };
    }
  | {
      type: "MEMBER_VOTE_POLL";
      payload: { groupId: number; message: Message };
    }
  | { type: "CHANGE_GROUP_EMOJI"; payload: { groupId: number; emoji: string } }
  | {
      type: "REACT_MESSAGE";
      payload: { groupId: number; message: Message };
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
  dispatch: React.ActionDispatch<[action: ChatAction]>;
  isLoadingGroup: boolean;
  groups: Group[];
  selectedGroupId: number | null;
  selectGroup: (groupId: number) => void;
  loadMoreMessages: () => Promise<void>;
  loadMoreGroups: () => Promise<void>;
  hasFirstLoadedMessages: (groupId: number) => boolean;
  statusGroupPagination: StatusGroupDataPag;
}
