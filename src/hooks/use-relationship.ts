import { useInfiniteQuery } from "@tanstack/react-query";
import { GetFriendListRes } from "@/services/types/friend-list";
import { ResponseData } from "@/types/response.types";
import { CursorPaging } from "@/utils/paging-response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RelationshipService } from "@/services/relationship.service";

export const useFriendRequests = () => {
  return useInfiniteQuery<ResponseData<CursorPaging<GetFriendListRes, number>>>(
    {
      queryKey: ["relationship", "requests"],
      queryFn: async ({ pageParam }) => {
        const response = await RelationshipService.getFriendRequestList(
          pageParam as number
        );
        return response.data;
      },
      initialPageParam: Number.MAX_SAFE_INTEGER,
      getNextPageParam: (lastPage) => lastPage.data.nextCursor,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useBlockList = () => {
  return useInfiniteQuery<ResponseData<CursorPaging<GetFriendListRes, number>>>(
    {
      queryKey: ["relationship", "block"],
      queryFn: async ({ pageParam }) => {
        const response = await RelationshipService.getBlockList(
          pageParam as number
        );
        return response.data;
      },
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
    }
  );
};

export const useSentRequests = () => {
  return useInfiniteQuery<ResponseData<CursorPaging<GetFriendListRes, number>>>(
    {
      queryKey: ["relationship", "sent"],
      queryFn: async ({ pageParam }) => {
        const response = await RelationshipService.getSentRequestList(
          pageParam as number
        );
        return response.data;
      },
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
    }
  );
};

export const useFriends = () => {
  return useInfiniteQuery<ResponseData<CursorPaging<GetFriendListRes, number>>>(
    {
      queryKey: ["relationship", "list"],
      queryFn: async ({ pageParam }) => {
        const response = await RelationshipService.getFriendList(
          pageParam as number
        );
        return response.data;
      },
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
    }
  );
};

// Type cho infinite query cache
type InfiniteQueryData<T> = {
  pages: T[];
  pageParams: unknown[];
};

// Xóa user khỏi danh sách trong cache infinite query
function updateInfiniteRemoveUser(
  oldData:
    | InfiniteQueryData<ResponseData<CursorPaging<GetFriendListRes, number>>>
    | undefined,
  userId: number
):
  | InfiniteQueryData<ResponseData<CursorPaging<GetFriendListRes, number>>>
  | undefined {
  if (!oldData) return oldData;
  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      data: {
        ...page.data,
        dataPag: page.data.dataPag.filter((u) => u.targetUserId !== userId),
      },
    })),
  };
}

// Thêm user vào danh sách (ví dụ block list hoặc friends list)
function updateInfiniteAddUser(
  oldData:
    | InfiniteQueryData<ResponseData<CursorPaging<GetFriendListRes, number>>>
    | undefined,
  user: GetFriendListRes
):
  | InfiniteQueryData<ResponseData<CursorPaging<GetFriendListRes, number>>>
  | undefined {
  if (!oldData) return oldData;
  return {
    ...oldData,
    pages: oldData.pages.map((page, idx) =>
      idx === 0
        ? {
            ...page,
            data: {
              ...page.data,
              dataPag: [
                user,
                ...page.data.dataPag.filter(
                  (u) => u.targetUserId !== user.targetUserId
                ),
              ],
            },
          }
        : page
    ),
  };
}

export function useRelationshipMutations() {
  const queryClient = useQueryClient();

  // Accept friend request
  const acceptRequest = useMutation({
    mutationFn: RelationshipService.acceptFriendRequest,
    onMutate: async (targetUserId: number) => {
      await queryClient.cancelQueries({
        queryKey: ["relationship", "requests"],
      });
      await queryClient.cancelQueries({ queryKey: ["relationship", "list"] });
      const prevRequests = queryClient.getQueryData<
        InfiniteQueryData<ResponseData<CursorPaging<GetFriendListRes, number>>>
      >(["relationship", "requests"]);
      const prevFriends = queryClient.getQueryData<
        InfiniteQueryData<ResponseData<CursorPaging<GetFriendListRes, number>>>
      >(["relationship", "list"]);

      // Remove khỏi requests
      queryClient.setQueryData(
        ["relationship", "requests"],
        (
          old:
            | InfiniteQueryData<
                ResponseData<CursorPaging<GetFriendListRes, number>>
              >
            | undefined
        ) => updateInfiniteRemoveUser(old, targetUserId)
      );

      // Tìm user vừa accept để add vào friends (nếu muốn optimistic)
      let userAdded: GetFriendListRes | undefined;
      if (prevRequests) {
        for (const page of prevRequests.pages) {
          const found = page.data.dataPag.find(
            (u) => u.targetUserId === targetUserId
          );
          if (found) {
            userAdded = found;
            break;
          }
        }
      }
      if (userAdded) {
        queryClient.setQueryData(
          ["relationship", "list"],
          (
            old:
              | InfiniteQueryData<
                  ResponseData<CursorPaging<GetFriendListRes, number>>
                >
              | undefined
          ) => updateInfiniteAddUser(old, userAdded!)
        );
      }

      return { prevRequests, prevFriends };
    },
    onError: (_err, _targetUserId, ctx) => {
      if (ctx?.prevRequests)
        queryClient.setQueryData(
          ["relationship", "requests"],
          ctx.prevRequests
        );
      if (ctx?.prevFriends)
        queryClient.setQueryData(["relationship", "list"], ctx.prevFriends);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship", "requests"] });
      queryClient.invalidateQueries({ queryKey: ["relationship", "list"] });
    },
  });

  // Reject friend request
  const rejectRequest = useMutation({
    mutationFn: RelationshipService.rejectFriendRequest,
    onMutate: async (targetUserId: number) => {
      await queryClient.cancelQueries({
        queryKey: ["relationship", "requests"],
      });
      const prevRequests = queryClient.getQueryData<
        InfiniteQueryData<ResponseData<CursorPaging<GetFriendListRes, number>>>
      >(["relationship", "requests"]);
      queryClient.setQueryData(
        ["relationship", "requests"],
        (
          old:
            | InfiniteQueryData<
                ResponseData<CursorPaging<GetFriendListRes, number>>
              >
            | undefined
        ) => updateInfiniteRemoveUser(old, targetUserId)
      );
      return { prevRequests };
    },
    onError: (_err, _targetUserId, ctx) => {
      if (ctx?.prevRequests)
        queryClient.setQueryData(
          ["relationship", "requests"],
          ctx.prevRequests
        );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship", "requests"] });
    },
  });

  // Cancel sent request
  const cancelSentRequest = useMutation({
    mutationFn: RelationshipService.cancelSentRequest,
    onMutate: async (targetUserId: number) => {
      await queryClient.cancelQueries({ queryKey: ["relationship", "sent"] });
      const prevSent = queryClient.getQueryData<
        InfiniteQueryData<ResponseData<CursorPaging<GetFriendListRes, number>>>
      >(["relationship", "sent"]);
      queryClient.setQueryData(
        ["relationship", "sent"],
        (
          old:
            | InfiniteQueryData<
                ResponseData<CursorPaging<GetFriendListRes, number>>
              >
            | undefined
        ) => updateInfiniteRemoveUser(old, targetUserId)
      );
      return { prevSent };
    },
    onError: (_err, _targetUserId, ctx) => {
      if (ctx?.prevSent)
        queryClient.setQueryData(["relationship", "sent"], ctx.prevSent);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship", "sent"] });
    },
  });

  // Remove friend
  const removeFriend = useMutation({
    mutationFn: RelationshipService.removeFriend,
    onMutate: async (targetUserId: number) => {
      await queryClient.cancelQueries({ queryKey: ["relationship", "list"] });
      const prevFriends = queryClient.getQueryData<
        InfiniteQueryData<ResponseData<CursorPaging<GetFriendListRes, number>>>
      >(["relationship", "list"]);
      queryClient.setQueryData(
        ["relationship", "list"],
        (
          old:
            | InfiniteQueryData<
                ResponseData<CursorPaging<GetFriendListRes, number>>
              >
            | undefined
        ) => updateInfiniteRemoveUser(old, targetUserId)
      );
      return { prevFriends };
    },
    onError: (_err, _targetUserId, ctx) => {
      if (ctx?.prevFriends)
        queryClient.setQueryData(["relationship", "list"], ctx.prevFriends);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship", "list"] });
    },
  });

  // Block user
  const blockUser = useMutation({
    mutationFn: RelationshipService.blockUser,
    onMutate: async (targetUserId: number) => {
      await queryClient.cancelQueries({ queryKey: ["relationship", "block"] });
      await queryClient.cancelQueries({ queryKey: ["relationship", "list"] });

      const prevBlock = queryClient.getQueryData<
        InfiniteQueryData<ResponseData<CursorPaging<GetFriendListRes, number>>>
      >(["relationship", "block"]);

      const prevFriends = queryClient.getQueryData<
        InfiniteQueryData<ResponseData<CursorPaging<GetFriendListRes, number>>>
      >(["relationship", "list"]);

      // Xoá khỏi friend-list
      queryClient.setQueryData(
        ["relationship", "list"],
        (
          old:
            | InfiniteQueryData<
                ResponseData<CursorPaging<GetFriendListRes, number>>
              >
            | undefined
        ) => updateInfiniteRemoveUser(old, targetUserId)
      );

      // Nếu bạn muốn optimistic add vào block-list, phải lấy đủ object user
      let userBlocked: GetFriendListRes | undefined;
      if (prevFriends) {
        for (const page of prevFriends.pages) {
          const found = page.data.dataPag.find(
            (u) => u.targetUserId === targetUserId
          );
          if (found) {
            userBlocked = found;
            break;
          }
        }
      }
      if (userBlocked) {
        queryClient.setQueryData(
          ["relationship", "block"],
          (
            old:
              | InfiniteQueryData<
                  ResponseData<CursorPaging<GetFriendListRes, number>>
                >
              | undefined
          ) => updateInfiniteAddUser(old, userBlocked!)
        );
      }

      return { prevBlock, prevFriends };
    },
    onError: (_err, _targetUserId, ctx) => {
      if (ctx?.prevBlock)
        queryClient.setQueryData(["relationship", "block"], ctx.prevBlock);
      if (ctx?.prevFriends)
        queryClient.setQueryData(["relationship", "list"], ctx.prevFriends);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship", "block"] });
      queryClient.invalidateQueries({ queryKey: ["relationship", "list"] });
    },
  });

  // Unblock user
  const unblockUser = useMutation({
    mutationFn: RelationshipService.unblockUser,
    onMutate: async (targetUserId: number) => {
      await queryClient.cancelQueries({ queryKey: ["relationship", "block"] });
      const prevBlock = queryClient.getQueryData<
        InfiniteQueryData<ResponseData<CursorPaging<GetFriendListRes, number>>>
      >(["relationship", "block"]);
      queryClient.setQueryData(
        ["relationship", "block"],
        (
          old:
            | InfiniteQueryData<
                ResponseData<CursorPaging<GetFriendListRes, number>>
              >
            | undefined
        ) => updateInfiniteRemoveUser(old, targetUserId)
      );
      return { prevBlock };
    },
    onError: (_err, _targetUserId, ctx) => {
      if (ctx?.prevBlock)
        queryClient.setQueryData(["relationship", "block"], ctx.prevBlock);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship", "block"] });
    },
  });

  return {
    acceptRequest,
    rejectRequest,
    cancelSentRequest,
    removeFriend,
    blockUser,
    unblockUser,
  };
}
