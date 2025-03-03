"use server";

import { registerInputSchema } from "@/lib/schema/registerSchema";
import { generateVerificationToken } from "@/lib/token";
import { hashPassword } from "@/lib/utils/password";
import { db } from "@/server/db";
import { z } from "zod";
export default async function register(
  values: z.infer<typeof registerInputSchema>
) {
  const validated = registerInputSchema.safeParse(values);
  if (!validated.success) return { error: validated.error.message };
  const { name, email, password } = validated.data;
  try {
    const userExist = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (userExist && userExist.email)
      return { error: "Email is already exist" };
    const hashedPassword = await hashPassword(password);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    await generateVerificationToken(email);
    return { message: "User created successfully" };
  } catch (e) {
    return { error: "Something went wrong", message: String(e) };
  }
}
