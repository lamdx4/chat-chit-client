import GoogleIcon from "@/assets/google-icon.svg";
import { Label } from "../ui/label";
import { useState } from "react";
import EditPasswordDialog from "./edit-password-dialog";
import { Button } from "../ui/button";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { ResponseData } from "@/types/response.types";
import { AxiosResponse } from "axios";
import User from "@/types/user";
import { axios_auth } from "@/config/axios-auth";
import { toast } from "sonner";
import toastValidateError from "@/utils/toast-validate-error";
import EditPhoneDialog from "./edit-phone-dialog";
import EditUserNameDialog from "./edit-username-dialog";
import useAuth from "@/hooks/use-auth";
import GetUrlGoogleLoginResponse from "@/services/types/get-url-google-login.response";

export default function EditAccountInformation({
  mutate,
}: {
  mutate: UseMutationResult<
    AxiosResponse<ResponseData<User>, unknown>,
    Error,
    void,
    unknown
  >;
}) {
  const user = useAuth().user!;
  const [isOpenEditPhoneDialog, setOpenEditPhoneDialog] = useState(false);
  const [isOpenEditUserNameDialog, setOpenEditUserNameDialog] = useState(false);

  const redirectGoogleLoginMutate = useMutation({
    mutationFn: () => {
      return axios_auth.get<ResponseData<GetUrlGoogleLoginResponse>>(
        "/user/link/google"
      );
    },
    onSuccess(response) {
      if (response.status === 200) {
        window.location.href = response.data.data.url;
      } else {
        toast.error("Failed to redirect to Google login.");
      }
    },
  });

  // const [isOpenEditDialog, setOpenEditDialog] = useState(false);
  const [isOpenChangePasswordDialog, setOpenChangePasswordDialog] =
    useState(false);

  const changPassword = useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      return await axios_auth.put<ResponseData<object>>(
        "auth/change-password",
        data
      );
    },
    onSuccess(response) {
      if (response.status === 200) {
        toast.success("Password changed successfully.");
        setOpenChangePasswordDialog(false);
      } else if (response.status === 400) {
        if (response.data.message === "VALIDATION_ERROR") {
          toastValidateError(response);
        }
        if (response.data.message === "PASSWORD_NOT_MATCH") {
          toast.error("Old password is not correct.");
        }
      } else {
        toast.error("Failed to change password.");
      }
    },
    onError(error) {
      console.log("Error changing password:", error);
    },
  });

  const onSubmitChangeUserName = useMutation({
    mutationFn: (data: { userName: string }) => {
      return axios_auth.post<ResponseData<object>>(
        "/user/profile/change-username",
        data
      );
    },
    onSuccess(response) {
      if (response.status === 200) {
        toast.success("User name changed successfully.");
        setOpenEditUserNameDialog(false);
        mutate.mutate();
        return;
      } else if (response.status === 400) {
        if (response.data.message === "VALIDATION_ERROR") {
          toastValidateError(response);
          return;
        }
      } else if (response.status === 409) {
        if (response.data.message === "USER_NAME_ALREADY_EXISTS") {
          toast.error("User name already exists.");
          return;
        } else if (response.data.message === "USER_NAME_NOT_CHANGED") {
          toast.error("User name is not changed.");
          return;
        }
      }
      toast.error("Failed to change user name.");
    },
  });

  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow-md ">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">
        Account Information
      </h2>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <Label className="text-gray-600">User Name</Label>
          <div className="flex items-center justify-between gap-6">
            <span className="text-gray-800">{user.userName}</span>
            <Button
              onClick={() => {
                setOpenEditUserNameDialog(true);
              }}
              variant={"ghost"}
              className="text-blue-500 hover:text-blue-600 transition duration-200 hover:underline"
            >
              Edit
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div className="text-gray-600">Phone</div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-gray-800">{user.phone}</span>
            <Button
              onClick={() => {
                setOpenEditPhoneDialog(true);
              }}
              variant={"ghost"}
              className="text-blue-500 hover:text-blue-600 transition duration-200 hover:underline"
            >
              Edit
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div className="text-gray-600">Email</div>
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-800">
                {user.email ? user.email : "Empty"}
              </span>
            </div>
            <Button
              onClick={() => {
                redirectGoogleLoginMutate.mutate();
              }}
              variant={"ghost"}
              className="text-blue-500 hover:text-blue-600 transition duration-200 hover:underline"
            >
              {user.email ? "Remove and add new one" : "Add new email"}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div className="text-gray-600">Password</div>
          <Button
            onClick={() => {
              setOpenChangePasswordDialog(true);
            }}
            variant="ghost"
            className="text-blue-500 hover:text-blue-600 transition duration-200 hover:underline"
          >
            Change Password
          </Button>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-6">
        Social Account
      </h2>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          {user.googleAccountId ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white">
                <img src={GoogleIcon} alt="Google" className="w-4 h-4" />
              </div>
              <span className="text-gray-600">Google</span>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <EditPasswordDialog
        isOpenChangePasswordDialog={isOpenChangePasswordDialog}
        onClose={() => {
          setOpenChangePasswordDialog(false);
        }}
        changePasswordMutate={changPassword}
      />
      <EditPhoneDialog
        isOpen={isOpenEditPhoneDialog}
        onClose={() => {
          setOpenEditPhoneDialog(false);
        }}
      />
      <EditUserNameDialog
        isOpen={isOpenEditUserNameDialog}
        onClose={() => {
          setOpenEditUserNameDialog(false);
        }}
        onSubmit={onSubmitChangeUserName}
      />
    </div>
  );
}
