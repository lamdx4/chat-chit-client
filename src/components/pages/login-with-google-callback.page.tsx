import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SpinLoadingElement } from "../elements/spin-loading.element";
import useAuth from "@/hooks/use-auth";
import authService from "@/services/auth.service";

const LoginCallbackPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const state = searchParams.get("state");
  const code = searchParams.get("code");

  const auth = useAuth();

  const mutation = useMutation({
    mutationFn: async (code: string) => {
      return authService.loginWithGoogle(code);
    },
    onSuccess: (res) => {
      if (res.status === 200) {
        const { token, user } = res.data.data;
        localStorage.setItem("accessToken", token.accessToken);
        localStorage.setItem("refreshToken", token.refreshToken);
        auth.authenticate(token.accessToken, user, token.refreshToken);
        navigate("/u");
      } else if (res.status === 404) {
        if (res.data.message === "USER_NOT_FOUND") {
          toast("Phone number or username or email or password is incorrect");
        }
        navigate("/login");
      } else if (res.status === 400) {
        if (res.data.message === "INVALID_INFORMATION_LOGIN") {
          toast("Phone number or username or email or password is incorrect");
        } else if (res.data.message === "INVALID_GOOGLE_ACCOUNT") {
          toast.error("Google account is not linked to any user.");
          navigate("/login");
        } else if (res.data.message === "VALIDATE_ERROR") {
          if (res.data.errors) {
            for (const key in res.data.errors) {
              if (Object.prototype.hasOwnProperty.call(res.data.errors, key)) {
                toast.error(res.data.errors[key]);
              }
            }
          }
        }
        toast.error("Login failed");
        navigate("/login");
      } else if (res.status === 500) {
        toast("Server error. Please try again later.");
        navigate("/login");
      }
    },
    onError: (error) => {
      console.log("API Login: ", error);
      navigate("/login");
      toast("An error occurred. Please try again later.");
    },
  });

  useEffect(() => {
    if (state && code) {
      mutation.mutate(code);
    } else {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, code]);

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      {mutation.isPending && <SpinLoadingElement />}
    </div>
  );
};

export default LoginCallbackPage;
