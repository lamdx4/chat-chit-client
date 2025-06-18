import { Member } from "./member.model";

export interface Poll {
  pollId: number;
  messageId: number;
  isMultipleChoice: boolean;
  isClosed: boolean;
  expiredAt?: Date;
  createdAt: Date;
  options: PollOption[];
}

export interface PollOption {
  optionId: number;
  text: string;
  votedBy: Member[];
}
