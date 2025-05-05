import { AxiosResponse } from "axios";
import { toast } from "sonner";

export default function toastValidateError(res: AxiosResponse) {
  if (res.data.errors) {
    for (const key in res.data.errors) {
      if (Object.prototype.hasOwnProperty.call(res.data.errors, key)) {
        toast.error(res.data.errors[key]);
      }
    }
  } else toast.error("Registration failed");
}
