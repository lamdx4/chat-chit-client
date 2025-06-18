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

    case "ADD_NEW_GROUP":
      if (state.groups.some((g) => g.groupId === action.payload.groupId)) {
        return state;
      }
      return {
        ...state,
        groups: [
          {
            ...action.payload,
            members: action.payload.members || [],
            messages: action.payload.messages || [],
          },
          ...state.groups,
        ],
      };

    case "ADD_GROUP":
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
      console.log(action.payload.message);
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

    case "ADD_MESSAGE_TO_EXISTING_GROUP": {
      action.payload.message.createdAt = new Date(
        action.payload.message.createdAt
      );

      const updatedGroups = state.groups.map((group) =>
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
      );

      // Sort groups by latest message timestamp, most recent first
      const sortedGroups = updatedGroups.sort((a, b) => {
        const aLatestMessage = a.messages[a.messages.length - 1];
        const bLatestMessage = b.messages[b.messages.length - 1];

        if (!aLatestMessage && !bLatestMessage) return 0;
        if (!aLatestMessage) return 1;
        if (!bLatestMessage) return -1;

        return (
          new Date(bLatestMessage.createdAt).getTime() -
          new Date(aLatestMessage.createdAt).getTime()
        );
      });

      return {
        ...state,
        groups: sortedGroups,
      };
    }

    case "CHANGE_GROUP_NAME": {
      const updatedGroups = state.groups.map((group) =>
        group.groupId === action.payload.groupId
          ? {
              ...group,
              name: action.payload.name,
            }
          : group
      );
      return {
        ...state,
        groups: updatedGroups,
      };
    }

    case "UPDATE_GROUP_AVATAR": {
      const updatedGroups = state.groups.map((group) =>
        group.groupId === action.payload.groupId
          ? {
              ...group,
              avatar: action.payload.avatar,
            }
          : group
      );
      return {
        ...state,
        groups: updatedGroups,
      };
    }

    case "MEMBER_VOTE_POLL": {
      const updatedGroups = state.groups.map((group) =>
        group.groupId === action.payload.groupId
          ? {
              ...group,
              messages: group.messages.map((message) =>
                message.messageId === action.payload.message.messageId
                  ? {
                      ...message, 
                      ...action.payload.message,
                    }
                  : message
              ),
            }
          : group
      );
      return {
        ...state,
        groups: updatedGroups,
      };
    }

    case "CHANGE_GROUP_EMOJI": {
      const updatedGroups = state.groups.map((group) =>
        group.groupId === action.payload.groupId
          ? {
              ...group,
              emoji: action.payload.emoji,
            }
          : group
      );
      return {
        ...state,
        groups: updatedGroups,
      };
    }

    case "REACT_MESSAGE": {
      const updatedGroups = state.groups.map((group) =>
        group.groupId === action.payload.groupId
          ? {
              ...group,
              messages: group.messages.map((message) =>
                message.messageId === action.payload.message.messageId
                  ? {
                      ...message,
                      reactions: action.payload.message.reactions || [],
                    }
                  : message
              ),
            }
          : group
      );
      return {
        ...state,
        groups: updatedGroups,
      };
    }

    default:
      return state;
  }
};
