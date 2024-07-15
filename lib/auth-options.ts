import prisma from "@/prisma/client";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRETE ?? "",
    }),
    CredentialProvider({
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "example@gmail.com",
        },
        password: {
          label: "password:",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        console.log(
          "************************************",
          credentials,
          "************************************",
        );

        try {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials!.email,
            },
          });

          if (!user || !user?.password) {
            throw new Error("Invalid credentials");
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials!.password,
            user.password,
          );

          if (!isCorrectPassword) {
            throw new Error("Invalid credentials");
          }
          return { ...user, password: null };
        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/", //sigin page
  },
};
