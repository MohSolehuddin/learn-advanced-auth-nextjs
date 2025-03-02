"use server";

import { signIn } from "@/auth";
import { LoginSchema } from "@/lib/schema/loginSchema";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { z } from "zod";

export default async function login(values: z.infer<typeof LoginSchema>) {
  const validated = LoginSchema.safeParse(values);
  if (!validated.success) return { error: validated.error.message };
  const { email, password } = validated.data;
  console.log(email, password);

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email or password is incorrect" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }

  return { message: "Logged in successfully" };
}
