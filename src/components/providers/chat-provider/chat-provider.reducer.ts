import { ChatAction, ChatState } from "./chat-provider.types";

export const chatReducer = (
  state: ChatState,
  action: ChatAction
): ChatState => {
  switch (action.type) {
    case "SET_STATE_LOADING":
      return { ...state, isLoadingGroup: action.payload };

    case "SET_SELECTED_GROUP_ID":
      return { ...state, selectedGroupId: action.payload };

    case "ADD_GROUPS": {
      for (const group of action.payload.groups) {
        group.createAt = new Date(group.createAt);
        group.messages.forEach((message) => {
          message.createdAt = new Date(message.createdAt);
        });
      }
      return {
        ...state,
        groups: [
          ...state.groups.filter(
            (group) =>
              !action.payload.groups.some((g) => g.groupId === group.groupId)
          ),
          ...action.payload.groups,
        ],
        statusGroupPagination: {
          isHasMore: action.payload.isHasMore,
          nextCursor: action.payload.nextCursor,
        },
      };
    }

    case "ADD_GROUP":
      if (
        state.groups.some((g) => g.groupId === action.payload.groupId)
      ) {
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
      action.payload.message.createdAt = new Date(
        action.payload.message.createdAt
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
                  (m) => m.userId === action.payload.member.userId
                )
                  ? group.members
                  : [action.payload.member, ...group.members],
              }
            : group
        ),
      };

    case "LOAD_MESSAGES": {
      const targetGroupIndex = state.groups.findIndex(
        (group) => group.groupId === action.payload.groupId
      );

      if (targetGroupIndex === -1) return state;

      const updatedGroups = [...state.groups];
      updatedGroups[targetGroupIndex] = {
        ...updatedGroups[targetGroupIndex],
        messages: [
          ...action.payload.messages,
          ...updatedGroups[targetGroupIndex].messages,
        ],
      };

      return {
        ...state,
        groups: updatedGroups,
      };
    }

    default:
      return state;
  }
};
