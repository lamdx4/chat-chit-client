import User from "@/types/user";

export interface GetFriendListRes {
    relationshipId: number;
    mutualFriends: number;
    targetUserId:   number;
    targetUser:     User;
    relationType:   string;
    direction:      string;
    createdAt:      Date;
}