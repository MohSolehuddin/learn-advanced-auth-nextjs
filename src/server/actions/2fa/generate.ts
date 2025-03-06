"use server";
import { authenticator } from "otplib";

export async function generate2fa() {
  const secret = authenticator.generateSecret();
  const token = authenticator.generate(secret);

  // Generate a QR Code URL for the authenticator app
  const otpauthUrl = authenticator.keyuri(
    "user@example.com",
    "YourApp",
    secret
  );

  return { secret, token, otpauthUrl };
}
