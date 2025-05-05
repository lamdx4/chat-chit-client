import { axios_base } from "@/config/axios-auth";
import { ResponseData } from "@/types/response.types";
import { LoginResponseSuccessfully } from "./types/login-response.types";
import { FormValues } from "@/components/pages/register.page";

class AuthService {
  async login(email: string, password: string) {
    const form = new FormData();
    form.append("phone", email);
    form.append("password", password);
    const res = await axios_base.post<ResponseData<LoginResponseSuccessfully>>(
      "auth/login",
      form
    );

    return res.data;
  }
  async register(data: FormValues) {
    return axios_base.post<ResponseData<object>>("auth/register", data);
  }
}
export default new AuthService();
