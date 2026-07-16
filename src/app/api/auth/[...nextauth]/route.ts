import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? ""
    })
  ],
  session: {
    maxAge: 60 * 60, // 1 hour
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await prisma.user.findFirst({
            where: { emailId: user.email },
          });

          if (existingUser) {
            return true;
          }

          const _response = await prisma.user.create({
            data: {
              name: user.name,
              emailId: user.email,
            },
          });
        } catch (error) {
          console.error("Database registration failed via google:", error);
          return false;
        }
      }
      else if (account?.provider === "github" && user.email) {
        try {
          const existingUser = await prisma.user.findFirst({
            where: { emailId: user.email },
          });

          if (existingUser) {
            return true;
          }

          const _response = await prisma.user.create({
            data: {
              name: user.name,
              emailId: user.email,
            },
          });

        } catch (error) {
          console.error("Database registration failed via github:", error);
          return false;
        }
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
