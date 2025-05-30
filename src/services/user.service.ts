import { axios_auth } from "@/config/axios-auth";
import { ResponseData } from "@/types/response.types";
import User from "@/types/user";

export const userService = {
  updateProfile: async (editFormData: FormData) => {
    console.log(editFormData);
    throw new Error("Method not implemented.");
  },

  getProfileByUserName: async (userName: string) => {
    return axios_auth.get<ResponseData<User>>(`/user/search`, {
      params: {
        userName,
      },
    });
  },
};
