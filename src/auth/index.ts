import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { prisma } from "@/lib/prisma";
import { upsertUser } from "@/lib/repositories/user.repository";
import { allowRequest } from "@/lib/rate-limiter.util";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      if (!allowRequest(user.id)) {
        console.log("Rate limit exceeded for user:", user.id);
        return session;
      }
      try {
        await upsertUser({
          id: user.id,
          email: user.email,
          name: user.name ?? "",
        });
      } catch (err) {
        console.error(err);
      }
      return session;
    },
  },
});
