"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  File,
  MoreHorizontal,
  Phone,
  Plus,
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
import { useChatContext } from "@/hooks/use-group";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { GifIcon } from "@heroicons/react/24/solid";
import GifPicker from "gif-picker-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FilePreview } from "./file-preview";
import { Dialog, DialogContent } from "../ui/dialog";
import AudioRecorder from "./audio-recorder";

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

  const openExplorer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
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
  const { groups, selectedGroupId, sendTextMessage, loadMoreMessages } =
    useChatContext();
  const user = useAuth().user;
  const selectedGroup = groups.find(
    (group) => group.groupId === selectedGroupId
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Handle sending message with files
  const handleSendMessage = async () => {
    if (!inputRef.current?.value && selectedFiles.length === 0) return;

    const messageText = inputRef.current?.value || "";

    // Here you would typically upload the files and get URLs
    // Then send the message with file URLs
    console.log("Sending message with files:", {
      text: messageText,
      files: selectedFiles,
    });

    // For now, just send the text message
    if (messageText) {
      await sendTextMessage(selectedGroupId!, messageText);
      inputRef.current!.value = "";
    }

    // Clear files after sending
    setSelectedFiles([]);
    setIsUserFocusOnTyping(false);
    setIsEmojiPickerOpen(false);
  };

  // Xử lý scroll khi cuộn lên
  const handleScroll = useCallback(() => {
    if (containerRef.current?.scrollTop === 0) {
      console.log("Loading more messages...");
      loadMoreMessages().then(() => {
        const container = containerRef.current;
        if (container) {
          const previousHeight = container.scrollHeight;

          setTimeout(() => {
            const newHeight = container.scrollHeight;
            container.scrollTop = newHeight - previousHeight; // Giữ nguyên vị trí scroll
          }, 0);
        }
      });
    }
  }, [loadMoreMessages]);

  useEffect(() => {
    loadMoreMessages().then(() => {
      const container = containerRef.current;
      if (container) {
        const previousHeight = container.scrollHeight;
        setTimeout(() => {
          const newHeight = container.scrollHeight;
          container.scrollTop = newHeight - previousHeight; // Giữ nguyên vị trí scroll
        }, 0);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll đến cuối khi lần đầu load tin nhắn
  useEffect(() => {
    if (isFirstLoad && containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
      }, 0);
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, selectedGroup?.messages]);

  // Đăng ký sự kiện scroll
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

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
        className="flex-1 bg-white pr-3 overflow-auto overflow-x-hidden p-4 max-w-full"
        ref={containerRef}
      >
        <div className="flex gap-1 flex-col justify-end min-h-full ">
          {selectedGroup?.messages.map((message, index) => (
            <div key={index}>
              {message.userId === user!.userId ? (
                <MessageRight message={message} />
              ) : (
                <MessageTextLeft message={message} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* File Preview Area */}
      <FilePreview files={selectedFiles} onRemove={removeFile} />

      {/* Input Area */}
      <div className="p-2 flex items-center gap-2 justify-self-end mt-auto">
        <DropdownMenu>
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
        </DropdownMenu>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*, video/*, audio/*, application/pdf, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          multiple={true}
          onChange={handleImageSelect}
        />

        <Button variant="ghost" size="icon" onClick={openExplorer}>
          <File className="h-5 w-5" />
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
                onGifClick={(gif) => {
                  console.log(gif);
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

export default React.memo(MessageList);
