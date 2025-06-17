import MessageNotificationText from "./message-notification";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  MoreHorizontal,
  Phone,
  SendHorizonal,
  SmilePlusIcon,
  ThumbsUp,
  Video,
} from "lucide-react";
import { Input } from "../ui/input";
import MessageRight from "./message-right.element";
import MessageTextLeft from "./message-left.element";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useAuth from "@/hooks/use-auth";
import { useChatContext } from "@/hooks/use-chat";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { GifIcon, PaperClipIcon } from "@heroicons/react/24/solid";
import GifPicker from "gif-picker-react";
import { FilePreview } from "./file-preview";
import { Dialog, DialogContent } from "../ui/dialog";
import AudioRecorder from "./audio-recorder";
import { MessageType } from "@/types/message.model";
import { InfiniteScrollMessageTrigger } from "./infinite-scroll-trigger-messages";
import { chatService } from "@/services/group-service";
import { toast } from "sonner";
import allowedMimeTypes from "@/types/allowed-minetype";

interface MessageListProps {
  isOpenChatDetailsPanel: boolean;
  setIsOpenChatDetailsPanel: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  isOpenChatDetailsPanel,
  setIsOpenChatDetailsPanel,
}) => {
  const [audioRecording, setAudioRecording] = useState<Blob | null>(null);
  const [isOpenRecordDialog, setIsOpenRecordDialog] = useState(false);
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // const [shouldScrollToBottom] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const openExplorer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (selectedFiles.length + files.length > 5) {
      toast.error("You can only upload up to 5 files at a time.");
      return;
    }
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const [isUserFocusOnTyping, setIsUserFocusOnTyping] = useState(false);

  const { groups, selectedGroupId, loadMoreMessages } = useChatContext();

  const user = useAuth().user;

  const selectedGroup = groups.find(
    (group) => group.groupId === selectedGroupId
  );

  const containerRef = useRef<HTMLDivElement>(null);
  // const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Handle sending message with files
  const handleSendMessage = async () => {
    if (!inputRef.current?.value && selectedFiles.length === 0) return;

    const messageText = inputRef.current?.value || "";

    // Here you would typically upload the files and get URLs
    // Then send the message with file URLs

    // For now, just send the text message
    if (messageText && selectedFiles.length > 0) {
      await chatService
        .sendFileMessage(
          selectedGroupId!,
          selectedFiles,
          messageText,
          undefined, // You can set this if you want to reply to a specific message
          [] // You can set this if you want to manipulate members
        )
        .then((res) => {
          if (res.status === 400 && res.data.message === "INVALID_FILE_TYPE") {
            toast.error("Invalid file type. Please upload valid files.");
          }
        });
    } else if (selectedFiles.length > 0) {
      await chatService
        .sendFileMessage(
          selectedGroupId!,
          selectedFiles,
          messageText,
          undefined, // You can set this if you want to reply to a specific message
          [] // You can set this if you want to manipulate members
        )
        .then((res) => {
          if (res.status === 400 && res.data.message === "INVALID_FILE_TYPE") {
            toast.error("Invalid file type. Please upload valid files.");
          }
        });
    } else if (messageText) {
      await chatService.sendTextMessage(
        selectedGroupId!,
        MessageType.Text,
        messageText,
        [],
        undefined
      );
      inputRef.current!.value = "";
    }

    // Clear files after sending
    setSelectedFiles([]);
    setIsUserFocusOnTyping(false);
    setIsEmojiPickerOpen(false);
  };

  // Scroll xuống cuối
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [containerRef]);

  // Xử lý scroll khi cuộn lên
  const handleScroll = useCallback(() => {
    if (isFetchingNextPage) return;
    setIsFetchingNextPage(true);
    loadMoreMessages()
      .then(() => {
        // if (isFirstLoad && shouldScrollToBottom && containerRef.current) {
        //   setIsFirstLoad(false);
        //   containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
        //   return;
        // }
        const container = containerRef.current;
        if (container) {
          const previousHeight = container.scrollHeight;

          setTimeout(() => {
            const newHeight = container.scrollHeight;
            container.scrollTop = newHeight - previousHeight; // Giữ nguyên vị trí scroll
          }, 0);
        }
      })
      .finally(() => {
        setIsFetchingNextPage(false);
      });
  }, [isFetchingNextPage, loadMoreMessages]);

  return (
    <>
      {/* Chat Header */}
      <div className="flex items-center justify-between h-14  border-b border-gray-200 pl-1 pr-3">
        <Button
          className="flex justify-start gap-2 pl-2 pr-3 h-12 bg-white text-black hover:bg-[#F0F0F0] w-100"
          variant={"ghost"}
        >
          <Avatar className="w-9 h-9">
            <AvatarImage src={selectedGroup?.avatar || "/placeholder.svg"} />
            <AvatarFallback> {selectedGroup?.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-[15px] inline-block overflow-hidden text-ellipsis whitespace-nowrap ">
            {selectedGroup?.name}
          </span>
        </Button>

        <div className="flex items-center gap-2 justify-end">
          <Button className="rounded-2xl" variant="ghost" size="icon">
            <Phone className="size-5" size={36} />
          </Button>
          <Button className="rounded-2xl" variant="ghost" size="icon">
            <Video className="size-5" size={36} />
          </Button>
          <Button
            className={`rounded-2xl ${
              isOpenChatDetailsPanel ? "bg-gray-400" : ""
            }`}
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsOpenChatDetailsPanel();
            }}
          >
            <MoreHorizontal size={36} />
          </Button>
        </div>
      </div>
      {/* Messages */}
      <div
        className="flex-1 bg-white overflow-y-scroll h-full pl-2 pr-1 pb-2 max-w-full"
        ref={containerRef}
      >
        <div className="flex gap-1 flex-col justify-end overflow-y-scroll ">
          <InfiniteScrollMessageTrigger
            fetchNextPage={handleScroll}
            hasNextPage={true}
            isFetchingNextPage={isFetchingNextPage}
            groupId={selectedGroupId!}
          />
          {selectedGroup?.messages.map((message, index) => (
            <div key={index}>
              {(() => {
                if (message.type === MessageType.Notification)
                  return <MessageNotificationText message={message} />;
                else if (message.ownerMember?.userId === user!.userId) {
                  return <MessageRight message={message} />;
                } else if (message.ownerMember?.userId !== user!.userId) {
                  return <MessageTextLeft message={message} />;
                }
              })()}
            </div>
          ))}
        </div>
      </div>

      {/* File Preview Area */}
      <FilePreview files={selectedFiles} onRemove={removeFile} />

      {/* Input Area */}
      <div className="p-2 flex items-center gap-2 justify-self-end mt-auto">
        {/* <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                setIsOpenRecordDialog(true);
              }}
            >
              Record Audio
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={allowedMimeTypes.join(",")}
          multiple={true}
          onChange={handleImageSelect}
        />

        <Button variant="ghost" size="icon" onClick={openExplorer}>
          <PaperClipIcon className="h-5 w-5" />
        </Button>

        <Input
          ref={inputRef}
          onChange={(e) => {
            if (e.target.value.length > 0) {
              setIsUserFocusOnTyping(true);
            } else {
              setIsUserFocusOnTyping(false);
            }
          }}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              (e.currentTarget.value.length > 0 || selectedFiles.length > 0)
            ) {
              handleSendMessage();
            }
          }}
          placeholder="Type a message"
          className="focus:outline-white focus:ring-0 rounded-full bg-[#F3F3F5] focus:bg-gray-100"
        />
        {/* Emoji Picker Button and Popup */}
        <div className="relative">
          <Button
            className={`${isEmojiPickerOpen ? "bg-gray-400" : ""}`}
            variant="ghost"
            size="icon"
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
          >
            <SmilePlusIcon className="h-6 w-6" />
          </Button>
          {/* GIF Picker Button and Popup */}

          {isEmojiPickerOpen && (
            <div className="absolute bottom-12 right-0 z-10">
              <EmojiPicker
                emojiStyle={EmojiStyle.GOOGLE}
                onEmojiClick={(emojiData) => {
                  if (inputRef.current) {
                    const cursorPos = inputRef.current.selectionStart || 0;
                    const text = inputRef.current.value;
                    const newText =
                      text.slice(0, cursorPos) +
                      emojiData.emoji +
                      text.slice(cursorPos);
                    inputRef.current.value = newText;
                    setIsUserFocusOnTyping(true);
                  }
                }}
              />
            </div>
          )}
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            className={`${isGifPickerOpen ? "bg-gray-400" : ""}`}
            size="icon"
            onClick={() => setIsGifPickerOpen(!isGifPickerOpen)}
          >
            <GifIcon className="h-5 w-5" />
          </Button>

          {isGifPickerOpen && (
            <div className="absolute bottom-12 right-0 z-10">
              <GifPicker
                tenorApiKey={"AIzaSyBNRYh7EinjogorQL7pKiz-CDZTRhc5GHw"}
                onGifClick={async (gif) => {
                  await chatService.sendTextMessage(
                    selectedGroupId!,
                    MessageType.Gif,
                    gif.url,
                    [],
                    undefined
                  );
                  setIsGifPickerOpen(false);
                  // Handle selected GIF here
                }}
              />
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={
            "bg-transparent transition-opacity duration-300 " +
            (isUserFocusOnTyping || selectedFiles.length > 0
              ? "opacity-100 inline-flex"
              : "opacity-0 hidden")
          }
          onClick={handleSendMessage}
        >
          <SendHorizonal className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={
            "bg-transparent transition-opacity duration-300 " +
            (!isUserFocusOnTyping && selectedFiles.length === 0
              ? "opacity-100 inline-flex"
              : "opacity-0 hidden")
          }
        >
          <ThumbsUp className="h-5 w-5 text-[#0084ff]" />
        </Button>
      </div>

      <Dialog open={isOpenRecordDialog} onOpenChange={setIsOpenRecordDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <AudioRecorder setFileRecording={setAudioRecording} />
          {audioRecording && (
            <div className="flex justify-end mt-4">
              <Button
                variant="default"
                onClick={() => {
                  setIsOpenRecordDialog(false);
                  setAudioRecording(null);
                }}
              >
                Send
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessageList;
