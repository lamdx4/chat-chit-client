import User from "./user";

export class Member {
  memberId: number;
  lastview: Date | null;
  position: number;
  status: number;
  timeJoin: Date;
  inforMember: User;

  constructor(
    id: number,
    lastview: Date | null,
    position: number,
    status: number,
    timejoin: Date,
    inforMember: User
  ) {
    this.memberId = id;
    this.lastview = lastview;
    this.position = position;
    this.status = status;
    this.timeJoin = timejoin;
    this.inforMember = inforMember;
  }
}
