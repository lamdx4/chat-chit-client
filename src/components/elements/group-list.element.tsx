import { useContext, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChatContext } from "../providers/chat-provider/chat-provider.context";
import { customHumanize } from "@/config/humanize-duration";
import { GroupChatType } from "@/types/group.model";
import GroupLoadMoreTrigger from "./group-loadmore-trigger.element";
import { MessageType } from "@/types/message.model";
import useAuth from "@/hooks/use-auth";
import parseTemplate from "@/utils/parse-template";

const GroupList: React.FC = () => {
  const {
    groups,
    selectedGroupId,
    selectGroup,
    loadMoreGroups,
    isLoadingGroup,
    statusGroupPagination,
  } = useContext(ChatContext);

  const containerRef = useRef<HTMLDivElement>(null!);
  const myId = useAuth().user?.userId;
  return (
    <div className="overflow-y-auto h-full max-h-full" ref={containerRef}>
      {groups.map((group) => (
        <div
          key={group.groupId}
          className={`flex items-center pr-2 h-17 gap-2  rounded-xl m-1 hover:bg-[#F5F5F5] cursor-pointer ${
            selectedGroupId === group.groupId ? "bg-[#F0F0F0]" : ""
          }`}
          onClick={() => selectGroup(group.groupId)}
        >
          <Avatar className="w-12 h-12 ml-2">
            <AvatarImage src={group.avatar ?? undefined} />
            <AvatarFallback>{group.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 max-w-[75%]">
            <p className="text-[15px] truncate">
              {group.groupType === GroupChatType.Group
                ? group.name
                : (group.members[0].user?.fullName ?? "") +
                  " " +
                  (group.members[0].user?.fullName ?? "")}
            </p>
            <p className="text-gray-500 text-[13px] truncate">
              {((groupX) => {
                if (
                  groupX.messages.length > 0 &&
                  groupX.messages[groupX.messages.length - 1].type ===
                    "Notification"
                ) {
                  return parseTemplate(
                    groupX.messages[groupX.messages.length - 1].content,
                    groupX.messages[groupX.messages.length - 1]
                      .manipulateMembers
                  );
                } else if (
                  groupX.messages.length > 0 &&
                  groupX.messages[groupX.messages.length - 1].type ===
                    MessageType.Poll
                ) {
                  return (
                    <span className="text-gray-500">
                      {groupX.messages[groupX.messages.length - 1].ownerMember
                        .userId === myId
                        ? "You created a pol"
                        : groupX.messages[groupX.messages.length - 1]
                            .ownerMember.user?.fullName + " created a poll"}
                    </span>
                  );
                } else if (
                  groupX.messages.length > 0 &&
                  groupX.messages[groupX.messages.length - 1].type ===
                    MessageType.Gif
                ) {
                  return (
                    <span className="text-gray-500">
                      {groupX.messages[groupX.messages.length - 1].ownerMember
                        .userId === myId
                        ? "You sent a gif"
                        : groupX.messages[groupX.messages.length - 1]
                            .ownerMember.user?.fullName + " sent a gif"}
                    </span>
                  );
                } else if (
                  groupX.messages.length > 0 &&
                  groupX.messages[groupX.messages.length - 1].type ===
                    MessageType.Text
                ) {
                  return (
                    <span className="text-gray-500">
                      {groupX.messages[groupX.messages.length - 1].ownerMember
                        .userId === myId
                        ? "You: "
                        : groupX.messages[groupX.messages.length - 1]
                            .ownerMember.user?.fullName + ": "}
                      {groupX.messages[groupX.messages.length - 1].content}
                    </span>
                  );
                } else if (
                  groupX.messages.length > 0 &&
                  groupX.messages[groupX.messages.length - 1].type ===
                    MessageType.File
                ) {
                  return (
                    <span className="text-gray-500">
                      {groupX.messages[groupX.messages.length - 1].ownerMember
                        .userId === myId
                        ? "You sent a file "
                        : groupX.messages[groupX.messages.length - 1]
                            .ownerMember.user?.fullName + " sent a file"}
                    </span>
                  );
                } else return <>{"No messages yet"}</>;
              })(group)}
            </p>
          </div>
          <div>
            <span className="text-[13px] block text-gray-400">
              {group.messages.length > 0
                ? customHumanize(
                    group.messages[
                      group.messages.length - 1
                    ].createdAt.getTime() - Date.now()
                  )
                : "No messages yet"}
            </span>
          </div>
        </div>
      ))}
      {groups.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No groups available</p>
        </div>
      )}
      {statusGroupPagination.isHasMore && (
        <GroupLoadMoreTrigger
          onLoadMore={loadMoreGroups}
          isLoading={isLoadingGroup}
          containerRef={containerRef}
          threshold={100}
        />
      )}
    </div>
  );
};
export default GroupList;
