import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useAuth from "@/hooks/use-auth";
import husky1 from "@/assets/husky_funny.jpeg";
import husky2 from "@/assets/husky_funny2.jpeg";
import husky3 from "@/assets/husky_funny3.jpg";
import husky4 from "@/assets/husky_funny4.jpg";
import wolf from "@/assets/husky_wolf.jpeg";
import { axios_base } from "@/config/axios-auth";
import { ResponseData } from "@/types/response.types";
import { LoginResponseSuccessfully } from "@/services/types/login-response.types";
import { toast } from "sonner";

const loginSchema = z.object({
  identifier: z.string().min(1, "identifier number is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const [messageLogin, setMessage] = useState("");
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (loginData: LoginFormData) => {
      return axios_base.post<ResponseData<LoginResponseSuccessfully>>(
        "auth/login",
        loginData
      );
    },
    onSuccess: (res) => {
      if (res.status === 200) {
        const { token, user } = res.data.data;
        localStorage.setItem("accessToken", token.accessToken);
        localStorage.setItem("refreshToken", token.refreshToken);
        auth.authenticate(token.accessToken, user, token.refreshToken);
        navigate("/u");
      } else if (res.status === 404) {
        if (res.data.message === "USER_NOT_FOUND" ) {
          setMessage("Identifier or password is incorrect");
        }
      } else if (res.status === 400) {
        if (res.data.message === "INVALID_INFORMATION_LOGIN") {
          setMessage("Identifier or password is incorrect");
        }
        else if (res.data.message === "VALIDATE_ERROR") {
          if (res.data.errors) {
            for (const key in res.data.errors) {
              if (Object.prototype.hasOwnProperty.call(res.data.errors, key)) {
                toast.error(res.data.errors[key]);
              }
            }
          } else toast.error("Registration failed");
        }
      } else if (res.status === 500) {
        setMessage("Server error. Please try again later.");
      }
      console.log("Login successful", res.data);
    },
    onError: (error) => {
      console.log("API Login: ", error);
      setMessage("An error occurred. Please try again later.");
    },
  });

  return (
    <div className="bg-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              A place for meaningful conversations
            </h1>
            <p className="text-gray-600 text-lg">
              Connect with your friends and family, build your community and
              deepen your interests.
            </p>
            <form
              onSubmit={form.handleSubmit((data) => {
                setMessage("");
                mutation.mutate(data);
              })}
              autoComplete="off"
            >
              <div className="space-y-4 max-w-md">
                <Input
                  {...form.register("identifier")}
                  type="text"
                  placeholder="identifier number"
                  className="h-12"
                  autoFocus
                  disabled={mutation.isPending}
                />
                {form.formState.errors.identifier && (
                  <p className="text-sm text-red-700">
                    {form.formState.errors.identifier.message}
                  </p>
                )}

                <Input
                  {...form.register("password")}
                  type="password"
                  placeholder="Password"
                  className="h-12"
                  disabled={mutation.isPending}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-700">
                    {form.formState.errors.password.message}
                  </p>
                )}

                <p
                  className={`text-sm text-red-700 transition-opacity duration-500 ${
                    messageLogin ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {messageLogin}
                </p>
                <Button
                  className="w-full h-12 text-base bg-blue-500 hover:bg-blue-600"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Logging in..." : "Log In"}
                </Button>
                <div className="flex items-center justify-between">
                  <NavLink
                    to="/forgot-password"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Forgotten your password?
                  </NavLink>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-between space-x-2">
                    <p>You don't have an account?</p>
                    <NavLink
                      to="/register"
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Register
                    </NavLink>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - App Preview */}
          <div className="relative hidden lg:block">
            <div className="bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-2xl p-4 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200">
                    <img
                      src={wolf}
                      alt="User Avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Husky</div>
                    <div className="text-xs text-gray-500">Active 1h ago</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Chat Content */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-[4/3] rounded-lg bg-gray-100">
                    <img
                      src={husky1}
                      alt="Image 1"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="aspect-[4/3] rounded-lg bg-gray-100">
                    <img
                      src={husky2}
                      alt="Image 2"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="aspect-[4/3] rounded-lg bg-gray-100">
                    <img
                      src={husky3}
                      alt="Image 3"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="aspect-[4/3] rounded-lg bg-gray-100">
                    <img
                      src={husky4}
                      alt="Image 4"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-purple-600 text-white rounded-2xl p-3 max-w-[80%]">
                    <p>Lol, you look so funny 😂🤣</p>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="mt-4 flex items-center gap-2 border-t pt-4">
                <Input
                  placeholder="Search or generate AI stickers"
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
