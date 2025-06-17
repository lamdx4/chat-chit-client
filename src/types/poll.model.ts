
export interface Poll {
  pollId: number;
  messageId: number;
  isMultipleChoice: boolean;
  expiredAt?: Date;
  createdAt: Date;
}

export interface PollOption {
  optionId: number;
  pollId: number;
  text: string;
}
export interface PollVote {
  voteId: number;
  optionId: number;
  memberId: number;
  votedAt: Date;
}