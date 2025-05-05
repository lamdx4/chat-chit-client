import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ResponseData } from "@/types/response.types";

type EditPasswordDialogProps = {
  isOpenChangePasswordDialog: boolean;
  onClose?: () => void;
  changePasswordMutate?: UseMutationResult<
    AxiosResponse<ResponseData<object>, unknown>,
    Error,
    {
      oldPassword: string;
      newPassword: string;
    },
    unknown
  >;
};

export default function EditPasswordDialog({
  isOpenChangePasswordDialog: isOpenEditDialog,
  onClose,
  changePasswordMutate,
}: EditPasswordDialogProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (changePasswordMutate) {
      changePasswordMutate.mutate({ oldPassword, newPassword });
    }
  };

  return (
    <Dialog open={isOpenEditDialog} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new one.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Change Password</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
