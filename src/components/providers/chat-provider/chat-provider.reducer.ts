import { ChatAction, ChatState } from "./chat-provider.types";

export const chatReducer = (
  state: ChatState,
  action: ChatAction
): ChatState => {
  switch (action.type) {
    case "SET_FIRST_LOAD":
      return { ...state, isFirstLoadGroup: action.payload };

    case "SET_SELECTED_GROUP_ID":
      return { ...state, selectedGroupId: action.payload };

    case "ADD_GROUP":
      // Đảm bảo nhóm không bị thêm trùng lặp
      if (state.groups.some((g) => g.groupId === action.payload.groupId)) {
        return state;
      }
      return {
        ...state,
        groups: [
          ...state.groups,
          {
            ...action.payload,
            members: action.payload.members || [],
            messages: action.payload.messages || [],
          },
        ],
      };

    case "ADD_MESSAGE":
      action.payload.message.createAt = new Date(
        action.payload.message.createAt
      );
      return {
        ...state,
        groups: state.groups.map((group) =>
          group.groupId === action.payload.groupId
            ? {
                ...group,
                messages: group.messages.some(
                  (msg) => msg.messageId === action.payload.message.messageId
                )
                  ? group.messages
                  : [...group.messages, action.payload.message],
              }
            : group
        ),
      };

    case "ADD_MEMBER":
      return {
        ...state,
        groups: state.groups.map((group) =>
          group.groupId === action.payload.groupId
            ? {
                ...group,
                members: group.members.some(
                  (m) =>
                    m.inforMember.userId ===
                    action.payload.member.inforMember.userId
                )
                  ? group.members
                  : [action.payload.member, ...group.members],
              }
            : group
        ),
      };

    case "LOAD_MESSAGES":
      return {
        ...state,
        groups: state.groups.map((group) =>
          group.groupId === action.payload.groupId
            ? {
                ...group,
                messages: [...action.payload.messages, ...group.messages],
              }
            : group
        ),
      };

    default:
      return state;
  }
};
