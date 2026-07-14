import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session : {
    maxAge : 24 * 60 * 60 , // 24 hours
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await prisma.user.findFirst({
            where: { emailId: user.email }
          });

          if (existingUser) {
            return true;
          }

          const response = await prisma.user.create({
            data: {
              name: user.name,
              emailId: user.email
            }
          })

        } catch (error) {
          console.error("Database registration failed:", error);
          return false;
        }
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };