import Reaction from "./react.model";

export default interface Message {
  memberId: string;
  content: string;
  createAt: Date;
  groupId: number;
  messageId: number;
  userId: number;
  replyMessageId: number;
  status: number;
  type: number;
  reacts: Array<Reaction>;
  manipulates: Array<number>;
}
export enum MessageType {
  TEXT = 0,
  IMAGE = 1,
  VIDEO = 2,
  GIF = 3,
  VOTE = 4,
  NOTIFY = 5,
  LOCATION = 6,
  CONTACT = 7,
  AUDIO = 8,
  FILE_DOCUMENT = 9,
}
