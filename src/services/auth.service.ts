import { axios_base } from "@/config/axios-auth";
import { ResponseData } from "@/types/response.types";
import { LoginResponseSuccessfully } from "./types/login-response.types";
import { FormValues } from "@/components/pages/register.page";

const authService = {
  async login(email: string, password: string) {
    return axios_base.post<ResponseData<LoginResponseSuccessfully>>(
      "auth/login",
      {
        identifier: email,
        password: password,
      }
    );
  },

  async getLinkGoogleLoginUrl() {
    return axios_base.get<ResponseData<{ url: string }>>(
      "auth/login-with-google"
    );
  },
  async loginWithGoogle(code: string) {
    return axios_base.post<ResponseData<LoginResponseSuccessfully>>(
      "auth/login-with-google",
      {
        code: code,
      }
    );
  },
  async register(data: FormValues) {
    return axios_base.post<ResponseData<object>>("auth/register", data);
  },
};

export default authService;
