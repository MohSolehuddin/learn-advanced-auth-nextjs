import { db } from "@/server/db";

export async function getUserByEmail(email: string) {
  return db.user.findUnique({ where: { email } });
}
