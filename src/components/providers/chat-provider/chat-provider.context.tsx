import { createContext } from "react";
import { ChatContextType } from "./chat-provider.types";

export const ChatContext = createContext<ChatContextType>({
  groups: [],
  selectedGroupId: null,
  selectGroup: () => {},
  loadMoreMessages: async () => {},
  hasFirstLoadedMessages: () => false,
  isLoadingGroup: false,
  sendTextMessage: async () => {},
});

