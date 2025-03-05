"use server";
import { getUserByEmail, updateUser } from "@/data/user";
import { hashPassword, verifyPassword } from "@/lib/utils/password";

export const updatePassword = async (
  email: string,
  lastPassword: string,
  newPassword: string
) => {
  try {
    const user = await getUserByEmail(email);
    if (user) {
      const lastPasswordMatch = await verifyPassword(
        lastPassword,
        user?.password ?? ""
      );
      if (lastPasswordMatch) {
        if (lastPassword.trim() === newPassword.trim()) {
          return { error: "Password is same" };
        }
        const hashedNewPassword = await hashPassword(newPassword);
        await updateUser(user.id, {
          password: hashedNewPassword,
        });
        return { message: "Password updated successfully" };
      }
      return { error: "Invalid last password" };
    }
    return { error: "User not found" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};
