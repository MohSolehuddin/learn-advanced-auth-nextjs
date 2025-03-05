import authConfig from "@/auth.config";
import { db } from "@/server/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import { getUserById, makeEmailIsVerified } from "./data/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  events: {
    async linkAccount({ user }) {
      await makeEmailIsVerified(user.email ?? "");
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token, trigger, session }) {
      console.log({ trigger });
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;

      if (trigger === "update" && session) {
        token.name = session.user.name;
        token.email = session.user.email;
        token.image = session.user.image;
      }

      return token;
    },
  },
  ...authConfig,
});
