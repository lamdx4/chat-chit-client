import { CirclePlus, Search } from "lucide-react";
import { Input } from "../ui/input";
import GroupList from "../elements/group-list.element";
import MessageList from "../elements/message-list.element";
import { useContext, useState } from "react";
import { ChatContext } from "../providers/chat-provider/chat-provider.context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ChatDetailsPanel from "../elements/chat-details-panel";
import { CreateGroupChatDialog } from "../elements/create-group-dialog";

export default function MessageChat() {
  const { selectedGroupId, groups } = useContext(ChatContext);
  const [showChatDetails, setShowChatDetails] = useState(false);
  const [isOpenCreateGroupDialog, setIsOpenCreateGroupDialog] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-10 h-full gap-3 ">
      {/* Chat List */}
      <div
        className={`col-span-1 md:col-span-1 h-full flex flex-1 flex-col ${
          showChatDetails ? "lg:col-span-3" : "lg:col-span-3"
        }  border-r rounded-xl overflow-hidden 
       bg-white border-white`}
      >
        <div className="p-4 mb-1 border-b border-gray-200 ">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold mb-4">Chats</h1>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <CirclePlus />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem
                  onClick={() => setIsOpenCreateGroupDialog(true)}
                >
                  Create new group
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Messenger"
              className="pl-9 bg-gray-100 rounded-2xl"
            />
          </div>
        </div>
        <GroupList />
      </div>

      {/* Chat Area */}
      <div
        className={`col-span-1 md:col-span-2 ${
          showChatDetails ? "lg:col-span-5" : "lg:col-span-7"
        }  border-r overflow-y-scroll 
        rounded-xl bg-white border-white`}
      >
        <div className="flex-1 flex flex-col rounded-xl bg-white border-white h-full">
          {selectedGroupId ? (
            <MessageList
              key={selectedGroupId}
              isOpenChatDetailsPanel={showChatDetails}
              setIsOpenChatDetailsPanel={() => {
                setShowChatDetails(!showChatDetails);
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div>Please select a group to see messages.</div>
            </div>
          )}
        </div>
      </div>

      {showChatDetails && selectedGroupId && (
        <div className="col-span-1 lg:col-span-2 h-full overflow-hidden overflow-y-auto">
          <ChatDetailsPanel
            isOpen={showChatDetails}
            onClose={() => setShowChatDetails(false)}
            chatData={
              selectedGroupId
                ? groups.find((g) => g.groupId === selectedGroupId)
                : undefined
            }
          />
        </div>
      )}
      <CreateGroupChatDialog
        open={isOpenCreateGroupDialog}
        setOpen={setIsOpenCreateGroupDialog}
      ></CreateGroupChatDialog>
    </div>
  );
}
