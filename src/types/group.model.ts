import { Member } from "./member.model";
import Message from "./message.model";

export default interface Group {
  groupId: number;
  name: string;
  avatar: string | null;
  groupChatStatus: string;
  createAt: Date;
  groupType: string;
  link: string;
  messages: Message[];
  members: Member[];
  memberCount: number;
  unreadCount: number;
}

// son anh
export interface GroupRole {
  roleId: number;
  name: string;
}

export enum GroupChatType {
  Direct = "Direct",
  Group = "Group",
}

export enum GroupChatStatusType {
  Active = "Active",
  Inactive = "Inactive",
  Deleted = "Deleted",
}

export enum GroupPrivacyType {
  Public = "Public",
  Private = "Private",
}