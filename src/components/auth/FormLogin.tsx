"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/lib/schema/loginSchema";
import login from "@/server/actions/login";
import { Dialog } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import AlertSuccess from "../alerts/AlertSuccess";
import { AlertError } from "../alerts/error";
import InputOTPComponent from "../input/InputOTPComponent";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function FormLogin() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: undefined,
    },
  });

  const searchParams = useSearchParams();
  const { update } = useSession();

  const errorLinkingAnAccount =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Oops! Something went wrong, please choose another login method"
      : "";

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState("");

  const handleOtpChange = async (e: ChangeEvent<HTMLInputElement>) => {
    form.setValue("code", e.target.value);
    setOtp(e.target.value);
    if (e.target.value.length === 6) {
      setLoading(true);
      onSubmit(form.getValues());
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    const response = await login(values);
    if (response.error) setError(response.error);
    if (response.message) setSuccess(response.message);
    update();
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Dialog open={error === "2FA is required"}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&#39;re
                done.
              </DialogDescription>
            </DialogHeader>
            <InputOTPComponent
              handleOtpChange={handleOtpChange}
              otp={otp}
              error={error ?? ""}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertError message={error || errorLinkingAnAccount} />
        <AlertSuccess message={success ?? ""} />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Loading..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
