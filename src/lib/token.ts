"use server";
import {
  createVerificationToken,
  deleteExistingVerificationTokenByEmail,
  getVerificationTokenByEmail,
} from "@/data/verificationToken";
// import { v4 as uuidv4 } from "uuid";
export const generateVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 3600 * 1000);
  //   const token = uuidv4();

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) await deleteExistingVerificationTokenByEmail(email);
  return await createVerificationToken(email, token, expires);
};
