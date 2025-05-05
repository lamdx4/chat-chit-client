import User from "@/types/user";

export default interface GetInfoMemberResponse {
  memberId: number;
  lastview: null;
  position: number;
  status: number;
  timejoin: string;
  inforMember: User;
}
