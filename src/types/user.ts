export default interface User {
  userId: number;
  email?: string;
  phone: string;
  fullName: string;
  birthday: Date;
  gender: string;
  avatar?: string;
  bio: string;
  userName: string;
  country: string;
  isActive: number;
  googleAccountId?: string;
}
