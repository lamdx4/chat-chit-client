"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form schema for email reset
const emailFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Form schema for phone reset
const phoneFormSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must have at least 10 digits")
    .max(15, "Invalid phone number"),
});

// Form schema for verification code
const verificationFormSchema = z.object({
  code: z.string().min(4, "Verification code must be at least 4 characters"),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;
type PhoneFormValues = z.infer<typeof phoneFormSchema>;
type VerificationFormValues = z.infer<typeof verificationFormSchema>;

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetMethod, setResetMethod] = useState<"email" | "phone">("email");
  const [resetStage, setResetStage] = useState<
    "request" | "verification" | "success"
  >("request");
  const [contactInfo, setContactInfo] = useState("");

  // Email form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Phone form
  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  // Verification form
  const verificationForm = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmitEmail(values: EmailFormValues) {
    setIsSubmitting(true);
    try {
      // Simulate API call
      console.log("Reset password with email:", values.email);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store email for verification step
      setContactInfo(values.email);

      // Move to verification step
      setResetStage("verification");
    } catch (error) {
      console.error("Reset request error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitPhone(values: PhoneFormValues) {
    setIsSubmitting(true);
    try {
      // Simulate API call
      console.log("Reset password with phone:", values.phone);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store phone for verification step
      setContactInfo(values.phone);

      // Move to verification step
      setResetStage("verification");
    } catch (error) {
      console.error("Reset request error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitVerification(values: VerificationFormValues) {
    setIsSubmitting(true);
    try {
      // Simulate API call
      console.log("Verification code:", values.code);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Move to success step
      setResetStage("success");
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="  flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {resetStage === "request"
            ? "Enter your email or phone number to reset your password"
            : resetStage === "verification"
            ? "Enter the verification code we sent you"
            : "Your password has been reset successfully"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          {resetStage === "request" && (
            <>
              <CardHeader>
                <CardTitle>Reset your password</CardTitle>
                <CardDescription>
                  We'll send you a verification code to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="email"
                  onValueChange={(value) =>
                    setResetMethod(value as "email" | "phone")
                  }
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="phone">Phone</TabsTrigger>
                  </TabsList>

                  <TabsContent value="email">
                    <Form {...emailForm}>
                      <form
                        onSubmit={emailForm.handleSubmit(onSubmitEmail)}
                        className="space-y-4"
                      >
                        <FormField
                          control={emailForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your email address"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                We'll send a verification code to this email
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send reset code"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  <TabsContent value="phone">
                    <Form {...phoneForm}>
                      <form
                        onSubmit={phoneForm.handleSubmit(onSubmitPhone)}
                        className="space-y-4"
                      >
                        <FormField
                          control={phoneForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your phone number"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                We'll send a verification code to this phone
                                number
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send reset code"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          )}

          {resetStage === "verification" && (
            <>
              <CardHeader>
                <CardTitle>Enter verification code</CardTitle>
                <CardDescription>
                  We've sent a verification code to{" "}
                  {resetMethod === "email" ? "your email" : "your phone"} (
                  {contactInfo})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...verificationForm}>
                  <form
                    onSubmit={verificationForm.handleSubmit(
                      onSubmitVerification
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={verificationForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter verification code"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the code we sent to your {resetMethod}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify code"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </>
          )}

          {resetStage === "success" && (
            <>
              <CardHeader>
                <CardTitle>Password reset successful</CardTitle>
                <CardDescription>
                  Your password has been reset successfully
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <p className="text-center mb-6">
                  We've sent you an email with instructions to set a new
                  password.
                </p>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => (window.location.href = "/login")}
                >
                  Return to login
                </Button>
              </CardContent>
            </>
          )}

          <CardFooter className="flex justify-center border-t pt-6">
            <Button
              variant="link"
              onClick={() => (window.location.href = "/login")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
