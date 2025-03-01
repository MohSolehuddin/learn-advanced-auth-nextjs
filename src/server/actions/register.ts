"use server";

import { registerInputSchema } from "@/lib/schema/registerSchema";
import { db } from "@/server/db";
import bcrypt from "bcrypt";
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
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return { message: "User created successfully" };
  } catch (e) {
    return { error: "Something went wrong", message: String(e) };
  }
}
