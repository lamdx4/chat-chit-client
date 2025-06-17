import Reaction from "./react.model";
import { Member } from "./member.model";
import { Poll } from "./poll.model";
import { File } from "./file.model";

export enum MessageType {
  Text = "Text",
  Gif = "Gif",
  File = "File",
  Notification = "Notification",
  Contact = "Contact",
}

export enum MessageStatus {
  Normal = "Normal",
  DeletedByOwner = "DeletedByOwner",
  DeletedByAdmin = "DeletedByAdmin",
}

export default interface Message {
  messageId: number;
  content: string;
  createdAt: Date;
  type: MessageType;
  status: MessageStatus;
  replyMessageId?: number | null;
  isPin: boolean;
  memberId: number;
  fileId?: number;

  // Relation
  ownerMember: Member;
  replyMessage?: Message;
  inverseReplyMessage?: Message[];
  reactions?: Reaction[];
  manipulateMembers: Member[];
  poll?: Poll;
  files: File[];
}
