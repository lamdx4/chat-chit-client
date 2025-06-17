import { useReducer, useEffect, useCallback } from "react";
import { chatReducer } from "./chat-provider.reducer";
import { ChatContextType, ChatState } from "./chat-provider.types";
import MessageListener from "@/services/message-listener";
import { chatService } from "@/services/group-service";
import Message from "@/types/message.model";

const initialState: ChatState = {
  isLoadingGroup: false,
  groups: [],
  selectedGroupId: null,
  statusGroupPagination: {
    isHasMore: true,
    nextCursor: Number.MAX_SAFE_INTEGER,
  },
};

function useGroupModel(): ChatContextType {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load danh sách group ban đầu
  const loadMoreGroups = useCallback(async () => {
    chatService
      .getGroupList(state.statusGroupPagination.nextCursor, 5)
      .then(async (res) => {
        dispatch({ type: "ADD_GROUPS", payload: res });
      })
      .catch((err) => {
        console.error("Error loading groups:", err);
      })
      .finally(() => {
        dispatch({ type: "SET_STATE_LOADING", payload: false });
      });
  }, [state.statusGroupPagination.nextCursor]);

  useEffect(() => {
    loadMoreGroups();
  }, []);

  useEffect(() => {
    const handleNewMessage = async (message: Message) => {
      const groupExists = state.groups.some(
        (group) => group.groupId === message.ownerMember?.groupId
      );

      if (groupExists) {
        dispatch({
          type: "ADD_MESSAGE",
          payload: { groupId: message.ownerMember.groupId, message },
        });
      } else {
        const newGroup = await chatService.getInfoGroup(
          message.ownerMember?.groupId
        );
        const member = await chatService.getInfoMember(
          message.ownerMember.groupId,
          message.ownerMember.userId
        );
        if (newGroup && member) {
          dispatch({ type: "ADD_GROUP", payload: newGroup });
          dispatch({
            type: "ADD_MEMBER",
            payload: { groupId: newGroup.groupId, member },
          });
          dispatch({
            type: "ADD_MESSAGE",
            payload: { groupId: newGroup.groupId, message },
          });
        }
      }
    };
    MessageListener.getInstance().on("message", handleNewMessage);
    return () => {
      MessageListener.getInstance().off("message", handleNewMessage);
    };
  }, [state.groups]);

  const selectGroup = (groupId: number) => {
    dispatch({ type: "SET_SELECTED_GROUP_ID", payload: groupId });
  };

  const loadMoreMessages = useCallback(async () => {
    if (state.selectedGroupId === null) return;
    try {
      const group = state.groups.find(
        (g) => g.groupId === state.selectedGroupId
      );
      const cursor = group?.messages[0]?.messageId || -1;
      const newMessages = await chatService.getMessageList(
        state.selectedGroupId,
        cursor,
        20
      );
      dispatch({
        type: "LOAD_MESSAGES",
        payload: {
          groupId: state.selectedGroupId,
          messages: newMessages.reverse(),
        },
      });
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }, [state.selectedGroupId, state.groups]);

  const hasFirstLoadedMessages = useCallback(
    (groupId: number): boolean => {
      return state.groups.some((group) => group.groupId === groupId);
    },
    [state.groups]
  );

  return {
    isLoadingGroup: state.isLoadingGroup,
    groups: state.groups,
    selectedGroupId: state.selectedGroupId,
    selectGroup,
    loadMoreMessages,
    hasFirstLoadedMessages,
    loadMoreGroups,
    statusGroupPagination: state.statusGroupPagination,
  };
}

export default useGroupModel;
