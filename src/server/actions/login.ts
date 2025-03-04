"use server";

import { signIn } from "@/auth";
import { getUserByEmail, makeEmailIsVerified } from "@/data/user";
import { getVerificationTokenByEmail } from "@/data/verificationToken";
import { LoginSchema } from "@/lib/schema/loginSchema";
import senEmailVerification from "@/lib/sendEmailVerification";
import { generateVerificationToken } from "@/lib/token";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { z } from "zod";

export default async function login(values: z.infer<typeof LoginSchema>) {
  const validated = LoginSchema.safeParse(values);
  if (!validated.success) return { error: validated.error.message };
  const { email, password, verificationToken } = validated.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) return { error: "Email or password is incorrect" };

  const existingVerificationToken = await getVerificationTokenByEmail(email);

  if (
    !existingUser.emailVerified ||
    verificationToken !== existingVerificationToken?.token
  ) {
    const verification = await generateVerificationToken(email);

    if (verification?.status === "error")
      return { error: verification.message };
    const linkVerification = `http://localhost:3000/auth/verify-email?token=${verification?.data?.token}`;
    await senEmailVerification(email, linkVerification, existingUser.name);
    return {
      error:
        "Email is not verified, new link verification email is resend, please check your email",
    };
  }
  if (verificationToken) {
    await makeEmailIsVerified(email);
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    console.log("Something", error);
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
