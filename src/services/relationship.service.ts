import { axios_auth } from "@/config/axios-auth";
import { ResponseData } from "@/types/response.types";
import { GetFriendListRes } from "./types/friend-list";
import { CursorPaging } from "@/utils/paging-response";
import { GetRelationshipBetweenUser } from "./types/get-relationship-between-user";

export const RelationshipService = {
  sendFriendRequest: (targetUserId: number) =>
    axios_auth.post<ResponseData<unknown>>(
      "/user/relationship/send-friend-request",
      {
        targetUserId,
      }
    ),

  rejectFriendRequest: (targetUserId: number) =>
    axios_auth.post<ResponseData<unknown>>(
      "/user/relationship/reject-request-friend",
      {
        targetUserId,
      }
    ),

  acceptFriendRequest: (targetUserId: number) =>
    axios_auth.post<ResponseData<unknown>>(
      "/user/relationship/accept-request-friend",
      {
        targetUserId,
      }
    ),

  cancelSentRequest: (targetUserId: number) =>
    axios_auth.post<ResponseData<unknown>>(
      "/user/relationship/cancel-request-sent",
      { targetUserId }
    ),

  removeFriend: (targetUserId: number) =>
    axios_auth.post<ResponseData<unknown>>(
      "/user/relationship/friend/remove-friend",
      {
        targetUserId,
      }
    ),

  blockUser: (targetUserId: number) =>
    axios_auth.post<ResponseData<unknown>>("/user/relationship/block-user", {
      targetUserId,
    }),

  unblockUser: (targetUserId: number) =>
    axios_auth.post<ResponseData<unknown>>("/user/relationship/unblock-user", {
      targetUserId,
    }),

  getFriendList: (cursor?: number, searchTerm: string = "") =>
    axios_auth.get<ResponseData<CursorPaging<GetFriendListRes, number>>>(
      `/user/relationship/friend`,
      {
        params: {
          cursor: cursor ?? Number.MAX_SAFE_INTEGER,
          limit: 10,
          searchTerm: searchTerm ?? "",
        },
      }
    ),
  getFriendRequestList: (cursor?: number) =>
    axios_auth.get<ResponseData<CursorPaging<GetFriendListRes, number>>>(
      `user/relationship/friend-request-list`,
      {
        params: {
          cursor: cursor ?? Number.MAX_SAFE_INTEGER,
          limit: 10,
        },
      }
    ),
  getSentRequestList: (cursor?: number) =>
    axios_auth.get<ResponseData<CursorPaging<GetFriendListRes, number>>>(
      `/user/relationship/friend/friend-request-sent-list`,
      {
        params: {
          cursor: cursor ?? Number.MAX_SAFE_INTEGER,
          limit: 10,
        },
      }
    ),
  getBlockList: (cursor?: number) =>
    axios_auth.get<ResponseData<CursorPaging<GetFriendListRes, number>>>(
      `/user/relationship/block`,
      {
        params: {
          cursor: cursor ?? Number.MAX_SAFE_INTEGER,
          limit: 10,
        },
      }
    ),
  getUserRelationship: (targetUserId: number) =>
    axios_auth.get<ResponseData<GetRelationshipBetweenUser>>(
      `/user/relationship/get/${targetUserId}`
    ),
};
