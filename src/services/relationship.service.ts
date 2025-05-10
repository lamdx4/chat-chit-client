import { axios_auth } from "@/config/axios-auth";
import { ResponseData } from "@/types/response.types";
import { GetFriendListRes } from "./types/friend-list";
import { CursorPaging } from "@/utils/paging-response";

export const RelationshipService = {
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

  getFriendList: (cursor?: number) =>
    axios_auth.get<ResponseData<CursorPaging<GetFriendListRes, number>>>(
      `/user/relationship/friend?cursor=${
        cursor ?? Number.MAX_SAFE_INTEGER
      }&limit=10`
    ),
  getFriendRequestList: (cursor?: number) =>
    axios_auth.get<ResponseData<CursorPaging<GetFriendListRes, number>>>(
      `user/relationship/friend-request-list?${
        "cursor=" + (cursor ?? Number.MAX_SAFE_INTEGER)
      }&limit=10`
    ),
  getSentRequestList: (cursor?: number) =>
    axios_auth.get<ResponseData<CursorPaging<GetFriendListRes, number>>>(
      `/user/relationship/friend/friend-request-sent-list?cursor=${
        cursor ?? Number.MAX_SAFE_INTEGER
      }&limit=10`
    ),
  getBlockList: (cursor?: number) =>
    axios_auth.get<ResponseData<CursorPaging<GetFriendListRes, number>>>(
      `/user/relationship/block?cursor=${
        cursor ?? Number.MAX_SAFE_INTEGER
      }&limit=10`
    ),
};
