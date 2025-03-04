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
    // async signIn({ user, account }) {
    //   if (account?.provider !== "credentials") return true;
    //   const existingUser = await getUserById(user.email ?? "");
    //   if (!existingUser || !existingUser.emailVerified) return false;
    //   console.log("ini running dog");
    //   return true;
    // },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
      }
      console.log({ sessionToken: token, session });
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      return token;
    },
  },
  ...authConfig,
});
