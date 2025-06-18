import { createContext } from "react";
import { ChatContextType } from "./chat-provider.types";

export const ChatContext = createContext<ChatContextType>({
  dispatch: () => {},
  groups: [],
  selectedGroupId: null,
  selectGroup: () => {},
  loadMoreMessages: async () => {},
  loadMoreGroups: async () => {},
  hasFirstLoadedMessages: () => false,
  isLoadingGroup: false,
  statusGroupPagination: {
    isHasMore: true,
    nextCursor: Number.MAX_SAFE_INTEGER,
  },
});
