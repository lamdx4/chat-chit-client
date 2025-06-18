import Group, { GroupRole } from "./group.model";
import Message from "./message.model";
import Reaction from "./react.model";
import User from "./user";

export enum MemberStatusType {
  Invited = "Invited",
  AdminApprovalPending = "AdminApprovalPending",
  Active = "Active",
  Left = "Left",
  Banned = "Banned",
}

export interface Member {
  memberId: number;
  groupId: number;
  userId: number;
  lastReadMessageId?: number;
  lastReceivedMessageId?: number;
  roleId: number;
  status: MemberStatusType;
  timeJoin: Date;
  nickName: string;
  role?: GroupRole;
  group?: Group;
  user: User;
  lastReadMessage?: Message;
  lastReceivedMessage?: Message;
  manipulateMembers?: Member[];
  messages?: Message[];
  reactions?: Reaction[];
}
