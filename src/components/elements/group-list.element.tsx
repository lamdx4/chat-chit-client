import { useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChatContext } from "../providers/chat-provider/chat-provider.context";
import { customHumanize } from "@/config/humanize-duration";
import { GroupType } from "@/types/group.model";

const GroupList: React.FC = () => {
  const { groups, selectedGroupId, selectGroup } = useContext(ChatContext);
  return (
    <div className="overflow-auto overflow-x-hidden ">
      {groups.map((group) => (
        <div
          key={group.groupId}
          className={`flex items-center pr-2 h-17 gap-2 rounded-xl m-1 hover:bg-[#F5F5F5] cursor-pointer ${
            selectedGroupId === group.groupId ? "bg-[#F0F0F0]" : ""
          }`}
          onClick={() => selectGroup(group.groupId)}
        >
          <Avatar className="w-12 h-12 ml-2">
            <AvatarImage src={group.avatar} />
            <AvatarFallback>{group.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 max-w-[75%]">
            <p className="text-[15px] truncate">
              {group.type === GroupType.COMMUNITY
                ? group.name
                : (group.members[0].inforMember.fullName ?? "") +
                  " " +
                  (group.members[0].inforMember.fullName ?? "")}
            </p>
            <p className="text-gray-500 text-[13px] truncate">
              {group.messages.length > 0
                ? group.type === GroupType.COMMUNITY
                  ? group.members.find(
                      (member) =>
                        member.inforMember.userId ===
                        group.messages[group.messages.length - 1].userId
                    )?.inforMember.fullName ??
                    "" +
                      " " +
                      (group.members.find(
                        (member) =>
                          member.inforMember.userId ===
                          group.messages[group.messages.length - 1].userId
                      )?.inforMember.fullName ?? "") +
                      ": " +
                      group.messages[group.messages.length - 1].content
                  : group.messages[group.messages.length - 1].content
                : "No messages yet"}
            </p>
          </div>
          <div>
            <span className="text-[13px] block text-gray-400">
              {group.messages.length > 0
                ? customHumanize(
                    group.messages[
                      group.messages.length - 1
                    ].createAt.getTime() - Date.now()
                  )
                : "No messages yet"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
export default GroupList;
