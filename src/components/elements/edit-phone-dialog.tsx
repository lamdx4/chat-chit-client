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

type EditPhoneDialogProps = {
  isOpen: boolean;
  onClose?: () => void;
};

const phoneSchema = z.object({
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(15, "Phone number is too long")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
});

type PhoneForm = z.infer<typeof phoneSchema>;

export default function EditPhoneDialog({
  isOpen,
  onClose,
}: EditPhoneDialogProps) {
  const form = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  function onSubmit(
    // values: PhoneForm
  ) {}

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Your Phone Number</DialogTitle>
          <DialogDescription>
            Enter the new one you want to use.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="phone">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      id="phone"
                      placeholder="Enter your new phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Change Phone Number
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
