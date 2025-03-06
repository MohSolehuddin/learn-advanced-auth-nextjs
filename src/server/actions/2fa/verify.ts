"use server";
import { authenticator } from "otplib";

export async function verify2fa(secret: string, token: string) {
  const isValid = authenticator.check(token, secret);

  if (isValid) {
    return { message: "Token is valid", success: true };
  } else {
    return { message: "Invalid token", success: false };
  }
}
