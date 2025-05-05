import { axios_auth } from "@/config/axios-auth";
import { ResponseData } from "@/types/response.types";
import User from "@/types/user";

class UserService {
  async updateProfile(editFormData: FormData) {
    console.log(editFormData);
    throw new Error("Method not implemented.");
  }
  async getProfileByUserName(userName: string) {
    return axios_auth.get<ResponseData<User>>(`/user/search`, {
      params: {
        userName,
      },
    });
  }
}
export default new UserService();
