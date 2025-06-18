import { Member, MemberStatusType } from "@/types/member.model";
import Message, { MessageStatus, MessageType } from "@/types/message.model";
import User from "@/types/user";
import { FileServer } from "@/types/file.model";

export interface GroupDataRes {
  messages: Message[];
  emoji: string;
  groupId: number;
  name: string;
  createAt: Date;
  groupChatStatus: string;
  avatar: string | null;
  groupType: string;
  groupPrivacyType: string;
  link: string;
  latestMessage: LatestMessage;
  currentMember: CurrentMember;
  unreadCount: number;
  memberCount: number;
  members: Member[];
}

export interface CurrentMember {
  memberId: number;
  groupId: number;
  userId: number;
  lastReadMessageId: number;
  lastReceivedMessageId: number;
  roleId: number;
  status: MemberStatusType;
  timeJoin: Date;
  nickName: string;
  user: User;
  role?: GroupRole;
}

export interface GroupRole {
  roleId: number;
  name: string;
}

export interface LatestMessage {
  manipulateMembers: Member[];
  messageId: number;
  content: string;
  createdAt: Date;
  type: MessageType;
  status: MessageStatus;
  replyMessageId: null | number;
  isPin: boolean;
  memberId: number;
  fileId: null;
  ownerMember: CurrentMember;
  files: FileServer[];
}
