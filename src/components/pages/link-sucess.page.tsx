import { axios_auth } from "@/config/axios-auth";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SpinLoadingElement } from "../elements/spin-loading.element";
import { ResponseData } from "@/types/response.types";
import User from "@/types/user";
import useAuth from "@/hooks/use-auth";

const LinkSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const state = searchParams.get("state");
  const code = searchParams.get("code");

  const auth = useAuth();

  const myDetailInformationMutate = useMutation({
    mutationFn: () => {
      return axios_auth.get<ResponseData<User>>("/user/my-profile");
    },
    onError(error) {
      console.log("Error fetching user profile:", error);
    },
    onSuccess(data) {
      if (data.status !== 200) {
        console.log("Error fetching user profile:", data);
        return;
      }
      auth.updateUser(data.data.data);
      console.log("User profile data:", data);
    },
  });

  const linkGoogleMutation = useMutation({
    mutationFn: (data: { code: string; state: string }) =>
      axios_auth.post("/user/link/google", data),
    onSuccess: (res) => {
      if (res.status === 200) {
        myDetailInformationMutate.mutate();
        toast.success("Liên kết tài khoản thành công.");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
      navigate("/u/setting");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      navigate("/u/setting");
    },
  });

  useEffect(() => {
    if (state && code) {
      linkGoogleMutation.mutate({ code, state });
    } else {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      navigate("/setting");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, code]);

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      {linkGoogleMutation.isPending && <SpinLoadingElement />}
    </div>
  );
};

export default LinkSuccessPage;
