import User from "@/types/user";

export interface LoginResponseSuccessfully {
  user: User;
  token: Token;
}
export interface Token {
  accessToken:  string;
  refreshToken: string;
}
