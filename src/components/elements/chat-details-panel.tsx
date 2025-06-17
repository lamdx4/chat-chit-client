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
  Facebook,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import Group, { GroupChatType } from "@/types/group.model";

interface ChatDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  chatData?: Group;
}

export default function ChatDetailsPanel({
  isOpen,
  chatData,
}: ChatDetailsPanelProps) {
  if (!isOpen) return null;
  if (!chatData) return <></>;
  return (
    <div className="h-full border-l border-gray-200 bg-white overflow-y-auto">
      {/* Header with profile info */}
      <div className="flex flex-col items-center justify-center p-6 border-b border-gray-200">
        <Avatar className="h-20 w-20 mb-3">
          <AvatarImage src={chatData?.avatar || "/placeholder.svg"} />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">{chatData.name}</h2>
        <p className="text-gray-500 text-sm">
          {chatData.groupType === GroupChatType.Direct ? "" : ""}
        </p>

        {/* Action buttons */}
        <div className="flex justify-center gap-8 mt-6 w-full">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Facebook className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
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
          </CollapsibleContent>
        </Collapsible>

        {/* Customise chat */}
        <Collapsible defaultOpen className="w-full">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg">
            <span className="font-semibold text-base">Customise chat</span>
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Button
              variant="ghost"
              className="flex items-center gap-3 w-full justify-start p-3 rounded-lg"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                <Paintbrush className="h-4 w-4" />
              </div>
              <span>Change theme</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-3 w-full justify-start p-3 rounded-lg"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                <Smile className="h-4 w-4" />
              </div>
              <span>Change emoji</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-3 w-full justify-start p-3 rounded-lg"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                <Type className="h-4 w-4" />
              </div>
              <span>Edit nicknames</span>
            </Button>
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
    </div>
  );
}
