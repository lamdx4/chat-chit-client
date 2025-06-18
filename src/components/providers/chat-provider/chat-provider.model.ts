import { useReducer, useEffect, useCallback } from "react";
import { chatReducer } from "./chat-provider.reducer";
import { ChatContextType, ChatState } from "./chat-provider.types";
import MessageListener from "@/services/message-listener";
import { chatService } from "@/services/group-service";
import Message from "@/types/message.model";
import Group from "@/types/group.model";

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

  const handleNewMessage = useCallback(
    async (message: Message) => {
      const groupExists = state.groups.some(
        (group) => group.groupId === message.ownerMember?.groupId
      );

      if (groupExists) {
        dispatch({
          type: "ADD_MESSAGE_TO_EXISTING_GROUP",
          payload: { groupId: message.ownerMember.groupId, message },
        });
      } else {
        const newGroup = await chatService.getInfoGroup(
          message.ownerMember?.groupId
        );
        if (newGroup) {
          dispatch({ type: "ADD_GROUP", payload: newGroup });
          // dispatch({
          //   type: "ADD_MESSAGE",
          //   payload: { groupId: newGroup.groupId, message },
          // });
        }
      }
    },
    [state.groups]
  );

  const handleNewGroup = useCallback(
    async (group: Group) => {
      console.log("New group received:", group);
      const existingGroup = state.groups.find(
        (g) => g.groupId === group.groupId
      );
      if (!existingGroup) {
        dispatch({ type: "ADD_NEW_GROUP", payload: group });
        // const members = await chatService.getMemberList(group.groupId);
        // members.forEach((member) => {
        //   dispatch({
        //     type: "ADD_MEMBER",
        //     payload: { groupId: group.groupId, member },
        //   });
        // });
      } else {
        // sort
      }
    },
    [state.groups]
  );

  const renameGroup = useCallback(
    (data: { groupId: number; name: string }) => {
      console.log("Renaming group:", data.groupId, name);
      const existingGroup = state.groups.find(
        (g) => g.groupId === data.groupId
      );
      if (!existingGroup) {
        dispatch({
          type: "CHANGE_GROUP_NAME",
          payload: data,
        });
      } else {
        // sort
      }
    },
    [state.groups]
  );

  const changeAvatarGroup = useCallback(
    async (data: { groupId: number; avatar: string }) => {
      console.log("Changing avatar for group:", data.groupId, data.avatar);
      const existingGroup = state.groups.find(
        (g) => g.groupId === data.groupId
      );
      if (existingGroup) {
        dispatch({
          type: "UPDATE_GROUP_AVATAR",
          payload: { groupId: data.groupId, avatar: data.avatar },
        });
      }
    },
    [state.groups]
  );

  //TODO: Handle member vote poll
  const memberVotePoll = useCallback(
    (message: Message) => {
      const groupExists = state.groups.some(
        (group) => group.groupId === message.ownerMember?.groupId
      );
      if (groupExists) {
        dispatch({
          type: "MEMBER_VOTE_POLL",
          payload: { groupId: message.ownerMember.groupId, message },
        });
      }
    },
    [state.groups]
  );

  const changeEmojiAvatar = useCallback(
    (data: { groupId: number; emoji: string }) => {
      const existingGroup = state.groups.find(
        (g) => g.groupId === data.groupId
      );
      if (existingGroup) {
        dispatch({
          type: "CHANGE_GROUP_EMOJI",
          payload: { groupId: data.groupId, emoji: data.emoji },
        });
      }
    },
    [state.groups]
  );

  const handleReactMessage = useCallback(
    (data: { groupId: number; message: Message }) => {
      const existingGroup = state.groups.find(
        (g) => g.groupId === data.groupId
      );
      if (existingGroup) {
        dispatch({
          type: "REACT_MESSAGE",
          payload: { groupId: data.groupId, message: data.message },
        });
      }
    },
    [state.groups]
  );

  useEffect(() => {
    MessageListener.getInstance().on("react-message", handleReactMessage);
    MessageListener.getInstance().on("change-emoji-avatar", changeEmojiAvatar);
    MessageListener.getInstance().on("new-message", handleNewMessage);
    MessageListener.getInstance().on("new-group", handleNewGroup);
    MessageListener.getInstance().on("rename-group", renameGroup);
    MessageListener.getInstance().on("change-avatar-group", changeAvatarGroup);
    MessageListener.getInstance().on("member-vote-poll", memberVotePoll);
    return () => {
      MessageListener.getInstance().off("react-message", handleReactMessage);
      MessageListener.getInstance().off(
        "change-emoji-avatar",
        changeEmojiAvatar
      );
      MessageListener.getInstance().off("new-message", handleNewMessage);
      MessageListener.getInstance().off("new-group", handleNewGroup);
      MessageListener.getInstance().off("rename-group", renameGroup);
      MessageListener.getInstance().off(
        "change-avatar-group",
        changeAvatarGroup
      );
      MessageListener.getInstance().off("member-vote-poll", memberVotePoll);
    };
  }, [
    changeAvatarGroup,
    changeEmojiAvatar,
    handleNewGroup,
    handleNewMessage,
    handleReactMessage,
    memberVotePoll,
    renameGroup,
    state.groups,
  ]);

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
    dispatch,
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
