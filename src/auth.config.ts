import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "./data/user";
import { LoginSchema } from "./lib/schema/loginSchema";
import { verifyPassword } from "./lib/utils/password";
export default {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validateFields = LoginSchema.safeParse(credentials);
        if (!validateFields.success) return null;
        const { email, password } = validateFields.data;
        const user = await getUserByEmail(email);
        const isValid = await verifyPassword(password, user?.password ?? "");
        if (isValid) {
          return {
            id: user?.id,
            name: user?.name,
            email: user?.email,
            image: user?.image,
          };
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
