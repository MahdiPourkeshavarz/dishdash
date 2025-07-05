/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"; // ✅ Import GoogleProvider

export const authOptions: NextAuthOptions = {
  // ✅ Configure the Google OAuth Provider
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.username = user.email!.split("@")[0];
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
};
