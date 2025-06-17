import { axios_auth } from "@/config/axios-auth";
import Group from "@/types/group.model";
import Message, { MessageType } from "@/types/message.model";
import { ResponseData } from "@/types/response.types";
import PagingData from "./types/paging-data";
import { Member } from "@/types/member.model";
import { GroupDataRes } from "./types/get-list-group.res";

export const chatService = {
  async getGroupList(cursorId?: number, limit: number = 10) {
    return await axios_auth
      .get<ResponseData<PagingData<GroupDataRes>>>("/group/list", {
        params: {
          cursor: cursorId,
          limit: limit,
        },
      })
      .then((res) => {
        return {
          groups: res.data.data.dataPag.map((groupData) => {
            const group: Group = {
              groupId: groupData.groupId,
              name: groupData.name,
              avatar: groupData.avatar,
              groupChatStatus: groupData.groupChatStatus,
              createAt: new Date(groupData.createAt),
              groupType: groupData.groupType,
              link: groupData.link,
              messages: [
                {
                  messageId: groupData.latestMessage.messageId,
                  content: groupData.latestMessage.content,
                  createdAt: new Date(groupData.latestMessage.createdAt),
                  type: groupData.latestMessage.type,
                  status: groupData.latestMessage.status,
                  replyMessageId: groupData.latestMessage.replyMessageId,
                  isPin: groupData.latestMessage.isPin,
                  memberId: groupData.latestMessage.memberId,
                  ownerMember: groupData.latestMessage.ownerMember,
                  manipulateMembers: groupData.latestMessage.manipulateMembers,
                  files: groupData.latestMessage.files,
                },
              ],
              members: [
                {
                  memberId: groupData.currentMember.memberId,
                  groupId: groupData.currentMember.groupId,
                  userId: groupData.currentMember.userId,
                  lastReadMessageId: groupData.currentMember.lastReadMessageId,
                  lastReceivedMessageId:
                    groupData.currentMember.lastReceivedMessageId,
                  roleId: groupData.currentMember.roleId,
                  status: groupData.currentMember.status,
                  timeJoin: new Date(groupData.currentMember.timeJoin),
                  nickName: groupData.currentMember.nickName,
                  role: groupData.currentMember.role
                    ? {
                        roleId: groupData.currentMember.role.roleId,
                        name: groupData.currentMember.role.name,
                      }
                    : undefined,
                  user: groupData.currentMember.user,
                },
              ],
              memberCount: groupData.memberCount,
              unreadCount: groupData.unreadCount,
            };
            return group;
          }),
          isHasMore: res.data.data.hasMore,
          nextCursor: res.data.data.nextCursor,
        };
      })
      .catch((error) => {
        console.error("Error fetching group list:", error);
        return {
          groups: new Array<Group>(),
          isHasMore: false,
          nextCursor: 0,
        };
      });
  },

  async deleteGroup(groupId: number) {
    try {
      const response = await fetch(`http://localhost:3000/chat/${groupId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getMessageList(groupId: number, cursorId: number, limit: number) {
    try {
      const response = await axios_auth.get<ResponseData<PagingData<Message>>>(
        `group/${groupId}/message/list`,
        {
          params: {
            cursor: cursorId,
            limit: limit,
          },
        }
      );
      return response.data.data.dataPag;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Sends a message to a specified group.
   *
   * @param groupId - The ID of the group to which the message will be sent.
   * @param message - The message object containing the content to be sent.
   * @returns A promise that resolves to the response data from the server.
   */
  async sendTextMessage(
    groupId: number,
    messageType: MessageType,
    content: string,
    manipulates?: number[],
    replyMessageId?: number
  ) {
    return await axios_auth.post<ResponseData<Message>>(
      `group/${groupId}/message/send`,
      {
        content,
        messageType,
        replyMessageId: replyMessageId || undefined,
        manipulates: manipulates || [],
      }
    );
  },

  async sendFileMessage(
    groupId: number,
    file: File[],
    content: string,
    replyMessageId?: number,
    manipulates?: number[]
  ) {
    const formData = new FormData();
    file.forEach((f) => {
      formData.append("files", f);
    });
    formData.append("replyMessageId", replyMessageId?.toString() || "");
    formData.append("manipulates", JSON.stringify(manipulates || []));
    formData.append("content", content);
    return await axios_auth.post<ResponseData<Message>>(
      `group/${groupId}/message/send/files`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  async createGroup() {
    try {
      const response = await fetch(`http://localhost:3000/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getInfoGroup(groupId: number) {
    try {
      const res = await axios_auth.get<ResponseData<Group>>(
        `/group/${groupId}/information`
      );
      return res.data.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async getInfoMember(groupId: number, userId: number) {
    try {
      const res = await axios_auth.get<ResponseData<Member>>(
        `/group/${groupId}/member/${userId}`
      );
      return res.data.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
