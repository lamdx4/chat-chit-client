import MessageNotificationText from "./message-notification";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  MoreHorizontal,
  Phone,
  Plus,
  SendHorizonal,
  SmilePlusIcon,
  Video,
} from "lucide-react";
import PollMessage from "./poll-message.element";
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
import type Message from "@/types/message.model";
import { MessageType } from "@/types/message.model";
import { InfiniteScrollMessageTrigger } from "./infinite-scroll-trigger-messages";
import { chatService } from "@/services/group-service";
import { toast } from "sonner";
import allowedMimeTypes from "@/types/allowed-minetype";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import CreatePollDialog, { type Poll } from "./create-poll-dialog";
import { MentionInput } from "./mention-input";
import type { Member } from "@/types/member.model";

interface MessageListProps {
  isOpenChatDetailsPanel: boolean;
  setIsOpenChatDetailsPanel: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  isOpenChatDetailsPanel,
  setIsOpenChatDetailsPanel,
}) => {
  const [isOpenCreatePollDialog, setIsOpenCreatePollDialog] = useState(false);
  const [pollData, setPollData] = useState<Poll>({ question: "", options: [] });
  const [audioRecording, setAudioRecording] = useState<Blob | null>(null);
  const [isOpenRecordDialog, setIsOpenRecordDialog] = useState(false);
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const inputRef = useRef<HTMLInputElement>(null);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const lastMessageRef = useRef<Message>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [mentions, setMentions] = useState<
    Array<{
      id: string;
      memberId: number;
      nickName: string;
      fullName: string;
      start: number;
      end: number;
    }>
  >([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setSearchingMembers] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

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

  useEffect(() => {
    if (
      lastMessageRef.current !=
      selectedGroup?.messages[selectedGroup.messages.length - 1]
    ) {
      lastMessageRef.current =
        selectedGroup?.messages[selectedGroup.messages.length - 1] || null;
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [selectedGroup?.messages]);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearchMembers = useCallback(
    async (query: string): Promise<Array<Member>> => {
      if (!selectedGroupId || !query.trim()) return [];

      try {
        setSearchingMembers(true);
        const response = await chatService.searchMember(
          selectedGroupId,
          query,
          8
        );
        if (response.status === 200) {
          return response.data.data;
        } else {
          console.error("Failed to search members:", response);
        }
        return [];
      } catch (error) {
        console.error("Error searching members:", error);
        return [];
      } finally {
        setSearchingMembers(false);
      }
    },
    [selectedGroupId]
  );

  // Handle sending message with files
  const handleSendMessage = useCallback(async () => {
    if (
      messageText.trim().length == 0 &&
      selectedFiles.length === 0 &&
      selectedGroup
    ) {
      await chatService.sendTextMessage(
        selectedGroupId!,
        MessageType.Text,
        selectedGroup.emoji,
        mentions.map((m) => Number.parseInt(m.memberId.toString())),
        undefined
      );
      return;
    }

    if (!messageText.trim() && selectedFiles.length === 0) return;

    // For now, just send the text message
    if (messageText && selectedFiles.length > 0) {
      await chatService
        .sendFileMessage(
          selectedGroupId!,
          selectedFiles,
          messageText,
          undefined,
          mentions.map((m) => Number.parseInt(m.memberId.toString())) // Convert mentions to member IDs
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
          undefined,
          mentions.map((m) => Number.parseInt(m.memberId.toString()))
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
        mentions.map((m) => Number.parseInt(m.memberId.toString())),
        undefined
      );
    }

    // Clear everything after sending
    setMessageText("");
    setMentions([]);
    setSelectedFiles([]);
    setIsUserFocusOnTyping(false);
    setIsEmojiPickerOpen(false);
  }, [mentions, messageText, selectedFiles, selectedGroup, selectedGroupId]);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollToBottom = () => {
        requestAnimationFrame(() => {
          if (container && selectedGroup && isFirstLoad) {
            setIsFirstLoad(false);
            container.scrollTop = container.scrollHeight;
          }
        });
      };

      // Scroll to bottom when selectedGroup changes
      scrollToBottom();
    }
  }, [selectedGroup, containerRef, isFirstLoad]);

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
  const me = useAuth().user;
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
          {selectedGroup?.messages.map((message) => {
            const currentMember = selectedGroup?.members.find(
              (m) => m.userId === me!.userId
            );

            const handleVote = (_pollId: number, optionIds: number[]) => {
              chatService
                .votePoll(selectedGroupId!, message.messageId, optionIds)
                .then((res) => {
                  if (res.status === 200) toast.success("Vote successfully!");
                  else if (
                    res.status === 400 &&
                    res.data.message === "MULTIPLE_CHOICE_POLL_NOT_SUPPORTED"
                  )
                    toast.error("This poll does not support multiple choices.");
                })
                .catch((error) => {
                  console.error("Error voting poll:", error);
                  toast.error("Failed to vote. Please try again.");
                });
            };

            return (
              <div key={message.messageId}>
                {message.type === MessageType.Notification && (
                  <MessageNotificationText message={message} />
                )}
                {message.type === MessageType.Poll && (
                  <PollMessage
                    message={message}
                    currentMember={currentMember}
                    onVote={handleVote}
                  />
                )}
                {message.ownerMember?.userId === user!.userId &&
                  message.type !== MessageType.Notification &&
                  message.type !== MessageType.Poll && (
                    <MessageRight message={message} />
                  )}
                {message.ownerMember?.userId !== user!.userId &&
                  message.type !== MessageType.Notification &&
                  message.type !== MessageType.Poll && (
                    <MessageTextLeft message={message} />
                  )}
              </div>
            );
          })}
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
            <DropdownMenuItem
              onClick={() => {
                setIsOpenCreatePollDialog(true);
              }}
            >
              Create Poll
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

        <MentionInput
          value={messageText}
          onChange={(value, mentions) => {
            setMessageText(value);
            setMentions(mentions);
            if (value.length > 0) {
              setIsUserFocusOnTyping(true);
            } else {
              setIsUserFocusOnTyping(false);
            }
          }}
          onSubmit={(value) => {
            if (value.trim() || selectedFiles.length > 0) {
              handleSendMessage();
            }
          }}
          onSearchMembers={handleSearchMembers}
          placeholder="Type a message..."
          className="flex-1"
          disabled={false}
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
                  // const cursorPos = messageText.length;
                  const newText = messageText + emojiData.emoji;
                  setMessageText(newText);
                  setIsUserFocusOnTyping(true);
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
          onClick={() => {
            handleSendMessage();
          }}
          variant="ghost"
          size="icon"
          className={
            "bg-transparent transition-opacity duration-300 " +
            (!isUserFocusOnTyping && selectedFiles.length === 0
              ? "opacity-100 inline-flex"
              : "opacity-0 hidden")
          }
        >
          <>{selectedGroup?.emoji}</>
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
                  chatService.sendFileMessage(
                    selectedGroupId!,
                    [
                      new File([audioRecording], "recording.webm", {
                        type: "audio/webm",
                      }),
                    ],
                    "",
                    undefined, // You can set this if you want to reply to a specific message
                    [] // You can set this if you want to manipulate members
                  );
                }}
              >
                Send
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <CreatePollDialog
        isOpen={isOpenCreatePollDialog}
        setIsOpen={setIsOpenCreatePollDialog}
        poll={pollData}
        setPoll={setPollData}
        onClose={() => {}}
        onCreatePoll={(finalPoll) => {
          chatService
            .createPoll(
              selectedGroupId!,
              finalPoll.question,
              false,
              undefined,
              finalPoll.options.map((option) => option.text)
            )
            .then((res) => {
              if (res.status === 200) {
                toast.success("Poll created successfully!");
                setIsOpenCreatePollDialog(false);
              } else {
                toast.error("Failed to create poll. Please try again.");
              }
            })
            .catch((error) => {
              console.error("Error creating poll:", error);
              toast.error("Failed to create poll. Please try again.");
            });
        }}
      />
    </>
  );
};

export default MessageList;
