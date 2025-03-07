"use server";
import { auth } from "@/auth";
import { getUserByEmail, updateUser } from "@/data/user";
import { authenticator } from "otplib";

export async function verify2fa({
  token,
  secret,
}: {
  token: string;
  secret?: string;
}) {
  const session = await auth();
  let existingUser;
  if (!secret) existingUser = await getUserByEmail(session?.user?.email ?? "");

  if (existingUser && !existingUser.twoFA_key && !secret)
    return {
      message: "Please enable Two Factor Authentication",
      success: false,
    };

  const isValid = authenticator.check(
    token,
    secret ?? existingUser?.twoFA_key ?? ""
  );

  if (isValid) {
    if (secret)
      await updateUser(session?.user?.id as string, { twoFA_key: secret });
    return { message: "Token is valid", success: true };
  } else {
    return { message: "Invalid token", success: false };
  }
}
