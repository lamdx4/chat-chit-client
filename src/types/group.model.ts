import { Member } from "./member.model";
import Message from "./message.model";

export default interface Group {
  groupId: number;
  name: string;
  avatar: string;
  status: number;
  createAt: Date;
  type: GroupType;
  access: number;
  link: string;
  messages: Message[];
  members: Member[];
  totalMember: number;
  numMessageUnread: number;
}

export enum GroupType {
  COMMUNITY = 0,
  INVIDIAL = 1,
}
