import {
  Bell,
  ChevronDown,
  FileText,
  ImageIcon,
  LinkIcon,
  Pin,
  Paintbrush,
  Smile,
  Type,
  BellOff,
  ShieldAlert,
  SquareUserRound,
  Pencil,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import Group, { GroupChatType } from "@/types/group.model";
import { Dialog, DialogContent } from "../ui/dialog";
import { useRef, useState } from "react";
import { chatService } from "@/services/group-service";
import { toast } from "sonner";
import { useChatContext } from "@/hooks/use-chat";
import MembersListDialog from "./members-list-dialog";
import { useNavigate } from "react-router";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { AddMemberDialog } from "./add-member-dialog";

interface ChatDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  chatData?: Group;
}

export default function ChatDetailsPanel({
  isOpen,
  chatData: groupData,
}: ChatDetailsPanelProps) {
  const [isOpenInvitingMember, setIsOpenInvitingMember] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const nav = useNavigate();
  const [newNameGroup, setGroupName] = useState<string>("");
  const { dispatch } = useChatContext();
  const [isOpenRenameGroupDialog, setOpenRenameDialog] = useState(false); // Placeholder for rename dialog state
  const [isOpenListMemberDialog, setOpenListMemberDialog] = useState(false); // Placeholder for rename dialog state
  const fileInputRef = useRef<HTMLInputElement>(null);
  if (!isOpen) return null;
  if (!groupData) return <></>;

  const openExplorer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length === 0) {
      toast.error("No file selected");
    }
    await chatService
      .changeAvatarGroup(groupData.groupId, files[0])
      .then((res) => {
        dispatch({
          type: "UPDATE_GROUP_AVATAR",
          payload: {
            groupId: groupData.groupId,
            avatar: res.data.data.avatar || "",
          },
        });
        toast("Group avatar updated successfully");
      })
      .catch((error) => {
        console.error("Error updating group avatar:", error);
        toast.error("Failed to update group avatar");
      });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border-l border-gray-200 bg-white overflow-y-auto">
      {/* Header with profile info */}
      <div className="flex flex-col items-center justify-center p-6 border-b border-gray-200">
        <Avatar className="h-20 w-20 mb-3" onClick={openExplorer}>
          <AvatarImage src={groupData?.avatar || "/placeholder.svg"} />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold break-words text-center w-full max-w-xs truncate">
          {groupData.name || "Unnamed Chat"}
        </h2>
        <p className="text-gray-500 text-sm">
          {groupData.groupType === GroupChatType.Direct ? "" : ""}
        </p>

        {/* Action buttons */}
        <div className="flex justify-center gap-8 mt-6 w-full">
          {groupData.groupType === GroupChatType.Direct ? (
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <SquareUserRound className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </Button>
          ) : (
            <></>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Bell className="h-5 w-5" />
            <span className="text-xs">Mute</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="text-xs">Search</span>
          </Button>
        </div>
      </div>

      {/* Collapsible sections */}
      <div className="p-1">
        {/* Chat Info */}
        <Collapsible defaultOpen className="w-full">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg">
            <span className="font-semibold text-base">Chat Info</span>
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Button
              variant="ghost"
              className="flex items-center gap-3 w-full justify-start p-3 rounded-lg"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                <Pin className="h-4 w-4" />
              </div>
              <span>View pinned messages</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-3 w-full justify-start p-3 rounded-lg"
              onClick={() => setOpenListMemberDialog(true)}
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                <User className="h-4 w-4" />
              </div>
              <span>View member</span>
            </Button>
          </CollapsibleContent>
        </Collapsible>

        {/* Customise chat */}
        <Collapsible defaultOpen className="w-full">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg">
            <span className="font-semibold text-base">Customise chat</span>
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            {groupData.groupType === GroupChatType.Group ? (
              <Button
                variant="ghost"
                className="flex items-center gap-3 w-full justify-start p-3 rounded-lg"
                onClick={() => setOpenRenameDialog(true)}
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                  <Pencil className="h-4 w-4" />
                </div>
                <span>Change chat name</span>
              </Button>
            ) : (
              <></>
            )}
            <Button
              variant="ghost"
              className="flex items-center gap-3 w-full justify-start p-3 rounded-lg"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                <Paintbrush className="h-4 w-4" />
              </div>
              <span>Change theme</span>
            </Button>
            <div className="relative"></div>
            <Button
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              variant="ghost"
              className="flex items-center gap-3 w-full justify-start p-3 rounded-lg"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                <Smile className="h-4 w-4" />
              </div>
              <span>Change emoji</span>
            </Button>

            {groupData.groupType === GroupChatType.Group ? (
              <Button
                variant="ghost"
                className="flex items-center gap-3 w-full justify-start p-3 rounded-lg"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                  <Type className="h-4 w-4" />
                </div>
                <span>Edit nicknames</span>
              </Button>
            ) : (
              <></>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Media, files and links */}
        <Collapsible defaultOpen className="w-full">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg">
            <span className="font-semibold text-base">
              Media, files and links
            </span>
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Button
              variant="ghost"
              className="flex items-center gap-3 w-full justify-start p-3 rounded-lg"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                <ImageIcon className="h-4 w-4" />
              </div>
              <span>Media</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-3 w-full justify-start p-3 rounded-lg"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                <FileText className="h-4 w-4" />
              </div>
              <span>Files</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-3 w-full justify-start p-3 rounded-lg"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                <LinkIcon className="h-4 w-4" />
              </div>
              <span>Links</span>
            </Button>
          </CollapsibleContent>
        </Collapsible>

        {/* Privacy and support */}
        <Collapsible defaultOpen className="w-full">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg">
            <span className="font-semibold text-base">Privacy and support</span>
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Button
              variant="ghost"
              className="flex items-center gap-3 w-full justify-start p-3 rounded-lg"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                <BellOff className="h-4 w-4" />
              </div>
              <span>Mute notifications</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-3 w-full justify-start p-3 rounded-lg"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <span>Restrict</span>
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Dialog open={isOpenRenameGroupDialog}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Rename Group</h3>
            <input
              type="text"
              value={newNameGroup}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter new group name"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setOpenRenameDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle rename logic here
                  chatService
                    .changeGroupChatName(groupData.groupId, newNameGroup)
                    .then(() => {
                      dispatch({
                        type: "CHANGE_GROUP_NAME",
                        payload: {
                          groupId: groupData.groupId,
                          name: newNameGroup,
                        },
                      });
                      toast("Group renamed successfully");
                    }); // Replace with actual input value)
                  setOpenRenameDialog(false);
                  setGroupName(""); // Reset input field
                }}
              >
                Rename
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Change Emoji</h3>
            <EmojiPicker
              emojiStyle={EmojiStyle.GOOGLE}
              width={350}
              height={400}
              onEmojiClick={(emoji) => {
                console.log("Selected emoji:", emoji);
                chatService
                  .changeEmojiGroup(groupData.groupId, emoji.emoji)
                  .then(() => {
                    dispatch({
                      type: "CHANGE_GROUP_EMOJI",
                      payload: {
                        groupId: groupData.groupId,
                        emoji: emoji.emoji,
                      },
                    });
                    toast("Group emoji updated successfully");
                  });
                setIsEmojiPickerOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <MembersListDialog
        isOpen={isOpenListMemberDialog}
        onClose={() => setOpenListMemberDialog(false)}
        members={groupData.members}
        currentUserId={0}
        groupName={""}
        onSendMessage={function (userId: number): void {
          console.log("Send message to user:", userId);
        }}
        onChangeRole={function (memberId: number, roleId: number): void {
          console.log("Change role for member:", memberId, "to role:", roleId);
        }}
        onPromoteToAdmin={function (memberId: number): void {
          console.log("Promote member to admin:", memberId);
        }}
        onRemoveMember={function (memberId: number): void {
          console.log("Remove member:", memberId);
        }}
        onBanMember={function (memberId: number): void {
          console.log("Ban member:", memberId);
        }}
        onUnbanMember={function (memberId: number): void {
          console.log("Unban member:", memberId);
        }}
        onInviteMembers={() => {
          setIsOpenInvitingMember(true);
        }}
        onViewProfile={function (username: string): void {
          nav(`/u/profile/${username}`);
        }}
      />
      <AddMemberDialog
        open={isOpenInvitingMember}
        setOpen={setIsOpenInvitingMember}
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={"image/*"}
        multiple={false}
        onChange={handleImageSelect}
      />
    </div>
  );
}
