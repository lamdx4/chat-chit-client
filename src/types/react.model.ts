import { Member } from "./member.model";

export default interface Reaction {
  reactionId: number;

  emojiData: string;

  member: Member;
}
