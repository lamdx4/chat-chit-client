import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ResponseData } from "@/types/response.types";

type EdituserNameDialogProp = {
  isOpen: boolean;
  onClose?: () => void;
  onSubmit: UseMutationResult<
    AxiosResponse<ResponseData<object>, unknown>,
    Error,
    {
      userName: string;
    },
    unknown
  >;
};

const formSchema = z.object({
  userName: z
    .string()
    .nonempty("User name is required")
    .min(3, "User name must be at least 3 characters")
    .max(30, "User name must be at most 30 characters")
    .regex(
      /^[a-z0-9]+$/,
      "userName can only contain lowercase letters and numbers"
    ),
});

export default function EdituserNameDialog({
  isOpen,
  onClose,
  onSubmit,
}: EdituserNameDialogProp) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { userName: "" },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit.mutate(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Your User Name</DialogTitle>
          <DialogDescription>
            Enter the new one you want to use.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your new user name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Change User Name
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
