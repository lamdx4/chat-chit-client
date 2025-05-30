import { axios_auth } from "@/config/axios-auth";
import Group from "@/types/group.model";
import Message from "@/types/message.model";
import { ResponseData } from "@/types/response.types";
import PagingData from "./types/paging-data";
import { Member } from "@/types/member.model";
import { SentMessageDto } from "./types/sent-message-dto";

export const chatService = {
  async getGroupList(cursorId: number, limit: number) {
    return axios_auth.get<ResponseData<PagingData<Group>>>("/group", {
      params: {
        cursor: cursorId,
        limit: limit,
      },
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
        `http://localhost:3000/message/${groupId}`,
        {
          params: {
            cursor: cursorId,
            limit: limit,
          },
        }
      );
      return response.data.data.data;
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
  async sendMessage(
    groupId: number,
    message: SentMessageDto
  ): Promise<Message | null> {
    try {
      const response = await axios_auth.post<ResponseData<Message>>(
        `http://localhost:3000/message/${groupId}/text`,
        message
      );
      return response.data.data;
    } catch (error) {
      console.error(error);
      return null;
    }
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
        `/group/${groupId}/community-group`
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
