import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import User from "@/types/user";
import { ResponseData } from "@/types/response.types";
import { AxiosResponse } from "axios";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { axios_auth } from "@/config/axios-auth";
import { toast } from "sonner";
import useAuth from "@/hooks/use-auth";
import toastValidateError from "@/utils/toast-validate-error";
import getUrlFile from "@/utils/get-url-file";

type Country = {
  name: string;
  code: string;
};

// Zod schema
const schema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  bio: z.string().max(150, "Bio must be at most 150 characters"),
  gender: z.enum(["Male", "Female"], { required_error: "Gender is required" }),
  birthday: z
    .object({
      day: z.string().min(1, "Day is required"),
      month: z.string().min(1, "Month is required"),
      year: z.string().min(4, "Year is required"),
    })
    .refine(
      (val) =>
        val &&
        val.day &&
        val.month &&
        val.year &&
        !isNaN(
          Date.parse(
            `${val.year}-${val.month.padStart(2, "0")}-${val.day.padStart(
              2,
              "0"
            )}`
          )
        ),
      {
        message: "Invalid date",
        path: ["birthday"],
      }
    ),
  country: z.string().max(100, "Country too long").optional(),
});

type ProfileDataTypeSubmitType = {
  fullName: string;
  bio: string;
  gender: "Male" | "Female";
  birthday: string;
  country?: string | undefined;
};

type ProfileDataType = z.infer<typeof schema>;

function parseDateToParts(date?: Date | string) {
  if (!date) return { day: "", month: "", year: "" };
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return { day: "", month: "", year: "" };
  return {
    day: String(d.getDate()),
    month: String(d.getMonth() + 1),
    year: String(d.getFullYear()),
  };
}

export default function EditProfileTab({
  mutate,
}: {
  mutate: UseMutationResult<
    AxiosResponse<ResponseData<User>, unknown>,
    Error,
    void,
    unknown
  >;
}) {
  const updateAvatarProfile = useMutation({
    mutationFn: (data: FormData) => {
      return axios_auth.post<ResponseData<User>>(
        "/user/profile/change-avatar",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    onSuccess(res) {
      if (res.status === 200) {
        mutate.mutate();
        toast.success("Avatar updated successfully");
      } else if (res.status === 400) {
        if (res.data.message === "VALIDATE_ERROR") {
          if (res.data.errors) {
            toastValidateError(res);
          } else toast.error("Change avatar failed");
        }
      } else {
        alert("Error updating avatar");
      }
    },
    onError(e) {
      console.error("Error updating avatar:", e);
    },
  });

  // Quốc gia từ API ngoài
  const user: User = useAuth().user!;

  const [countries, setCountries] = useState<Country[]>([]);
  const [countryLoading, setCountryLoading] = useState(false);
  const updateProfileMutate = useMutation({
    mutationFn: (data: Partial<ProfileDataTypeSubmitType>) => {
      return axios_auth.put<ResponseData<object>>("/user/my-profile", data);
    },
    onSuccess(res) {
      if (res.status === 200) {
        mutate.mutate();
        toast.success("Profile updated successfully");
      } else if (res.status === 400) {
        if (res.data.message === "VALIDATE_ERROR") {
          if (res.data.errors) {
            toastValidateError(res);
          } else toast.error("Change profile failed");
        }
      } else {
        alert("Error updating profile");
      }
    },
    onError(e) {
      console.error("Error updating profile:", e);
    },
  });
  useEffect(() => {
    setCountryLoading(true);
    fetch("https://restcountries.com/v3.1/all?fields=cca2,name")
      .then((res) => res.json())
      .then((data: { name: { common: string }; cca2: string }[]) => {
        const countryList = data
          .map((c) => ({
            name: c.name.common,
            code: c.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryList);
      })
      .finally(() => setCountryLoading(false));
  }, []);

  const birthdayParts = parseDateToParts(user.birthday);

  const form = useForm<ProfileDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user.fullName ?? "",
      bio: user.bio ?? "",
      gender: user.gender === "Female" ? "Female" : "Male",
      birthday: birthdayParts,
      country: user.country ?? "",
    },
    mode: "onTouched",
  });

  const years = Array.from({ length: 120 }, (_, i) =>
    String(new Date().getFullYear() - i)
  );
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));

  const bioValue = form.watch("bio");

  function onSubmit(data: ProfileDataType) {
    // Kiểm tra các trường thay đổi so với user ban đầu
    const changedFields: Partial<ProfileDataTypeSubmitType> = {};
    if (data.fullName !== user.fullName) changedFields.fullName = data.fullName;
    if (data.bio !== user.bio) changedFields.bio = data.bio;
    if (data.gender !== user.gender) changedFields.gender = data.gender;
    const userBirthdayParts = parseDateToParts(user.birthday);
    if (
      data.birthday.day !== userBirthdayParts.day ||
      data.birthday.month !== userBirthdayParts.month ||
      data.birthday.year !== userBirthdayParts.year
    ) {
      // Đưa birthday về dạng chuẩn ISO 8601 (yyyy-MM-ddTHH:mm:ss.sssZ)
      const year = data.birthday.year.padStart(4, "0");
      const month = data.birthday.month.padStart(2, "0");
      const day = data.birthday.day.padStart(2, "0");
      // Tạo đối tượng Date UTC để đảm bảo chuẩn quốc tế
      changedFields.birthday = new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day))
      ).toISOString();
    }
    if (data.country !== user.country) changedFields.country = data.country;

    // If no fields have changed, return
    if (Object.keys(changedFields).length === 0) {
      toast("No changes detected.");
      return;
    }
    updateProfileMutate.mutate(changedFields);
  }

  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow-md ">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">
        Account Information
      </h2>
      <Form {...form}>
        <form
          className=" p-6"
          onSubmit={form.handleSubmit(onSubmit)}
          autoComplete="off"
        >
          {/* Avatar + username */}
          <div className="flex items-center mb-8 gap-4">
            <Avatar className="w-14 h-14">
              <AvatarImage
                src={user.avatar ? getUrlFile(user.avatar) : ""}
                alt={user.fullName}
              />
              <AvatarFallback>{user.fullName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.fullName}</p>
              <p className="text-gray-500 text-sm">@{user.userName}</p>
            </div>
            <Button
              type="button"
              className="ml-auto"
              variant="secondary"
              size="sm"
              onClick={() => {
                // Trigger hidden file input click
                document.getElementById("avatar-upload-input")?.click();
              }}
            >
              Change photo
            </Button>
            <input
              id="avatar-upload-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const formData = new FormData();
                  formData.append("avatar", file);
                  updateAvatarProfile.mutate(formData);
                }
                // Reset input value to allow re-uploading the same file
                e.currentTarget.value = "";
              }}
            />
          </div>

          {/* Full name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Your full name"
                    maxLength={100}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us something about yourself"
                    maxLength={150}
                    {...field}
                  />
                </FormControl>
                <div className="flex justify-end text-xs text-muted-foreground mt-1">
                  {bioValue?.length || 0} / 150
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>Gender</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Birthday: 3 select box */}
          <FormField
            control={form.control}
            name="birthday.day"
            render={() => (
              <FormItem className="mb-6 flex flex-col">
                <FormLabel>Birthday</FormLabel>
                <div className="flex gap-2 flex-row">
                  <Select
                    value={form.watch("birthday.day")}
                    onValueChange={(val) =>
                      form.setValue("birthday.day", val, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Day</SelectLabel>
                        {days.map((d) => (
                          <SelectItem value={d} key={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    value={form.watch("birthday.month")}
                    onValueChange={(val) =>
                      form.setValue("birthday.month", val, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Month</SelectLabel>
                        {months.map((m) => (
                          <SelectItem value={m} key={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    value={form.watch("birthday.year")}
                    onValueChange={(val) =>
                      form.setValue("birthday.year", val, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-28">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Year</SelectLabel>
                        {years.map((y) => (
                          <SelectItem value={y} key={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel>Country</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Country</SelectLabel>
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {countryLoading && (
                  <FormDescription>Loading countries...</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit/Cancel */}
          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
