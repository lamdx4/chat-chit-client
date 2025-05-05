import { useReducer, useEffect } from "react";
import { chatReducer } from "./chat-provider.reducer";
import { ChatContextType, ChatState } from "./chat-provider.types";
import MessageListener from "@/services/message-listener";
import { chatService } from "@/services/group-service";
import Message from "@/types/message.model";

const initialState: ChatState = {
  isFirstLoadGroup: false,
  groups: [],
  selectedGroupId: null,
};

function useGroupModel(): ChatContextType {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load danh sách group ban đầu
  const firstLoadGroups = async () => {
    dispatch({ type: "SET_FIRST_LOAD", payload: true });
    chatService
      .getGroupList(-1, 20)
      .then(async (res) => {
        for (const group of res.data.data.data) {
          dispatch({ type: "ADD_GROUP", payload: group });
          for (const message of group.messages) {
            const member = await chatService.getInfoMember(
              group.groupId,
              message.userId
            );
            if (member) {
              dispatch({
                type: "ADD_MEMBER",
                payload: { groupId: group.groupId, member },
              });
            }
          }
        }
      })
      .catch((err) => {
        console.error("Error loading groups:", err);
      })
      .finally(() => {
        dispatch({ type: "SET_FIRST_LOAD", payload: false });
      });
  };

  useEffect(() => {
    firstLoadGroups();

    const handleNewMessage = async (messages: Message[]) => {
      for (const message of messages) {
        const groupExists = state.groups.some(
          (group) => group.groupId === message.groupId
        );

        if (groupExists) {
          dispatch({
            type: "ADD_MESSAGE",
            payload: { groupId: message.groupId, message },
          });
        } else {
          const newGroup = await chatService.getInfoGroup(message.groupId);
          const member = await chatService.getInfoMember(
            message.groupId,
            message.userId
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
      }
    };
    MessageListener.getInstance().on("message", handleNewMessage);
    return () => {
      MessageListener.getInstance().off("message", handleNewMessage);
    };
  }, []);

  const selectGroup = (groupId: number) => {
    dispatch({ type: "SET_SELECTED_GROUP_ID", payload: groupId });
  };

  const loadMoreMessages = async () => {
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
  };

  const hasFirstLoadedMessages = (groupId: number): boolean => {
    return state.groups.some((group) => group.groupId === groupId);
  };

  const sendTextMessage = async (
    groupId: number,
    content: string,
    replyMessageId?: number,
    manipulates?: number[]
  ) => {
    try {
      await chatService.sendMessage(groupId, {
        content,
        replyMessageId,
        manipulates,
      });
    } catch (error) {
      console.error(`Error sending message to group ${groupId}:`, error);
    }
  };

  return {
    isFirstLoadGroup: state.isFirstLoadGroup,
    groups: state.groups,
    selectedGroupId: state.selectedGroupId,
    selectGroup,
    loadMoreMessages,
    hasFirstLoadedMessages,
    sendTextMessage,
  };
}

export default useGroupModel;
