import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  secret:"18f105de83a4db48a323a67b4077dbe1",
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // Email + Password Authentication
    CredentialsProvider({
      name: "Email & Password",
      id: "email-password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username, // Ensure username is returned
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
        };
      },
    }),

    // Username-Only Authentication
    CredentialsProvider({
      name: "Username Only",
      id: "username-only",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        code: { label: "2FA Code", type: "text", optional: true }, // 2FA Code field
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username or password is required");
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("The password is incorrect");
        }

        // If 2FA is enabled, verify the code
        const twoFactorVerified = false;
  return {
          id: user.id,
          username: user.username,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
          twoFactorVerified, // Now it reflects the verification status
          statut:user.statut,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 10 * 60 * 60, // 10 hours in seconds
    updateAge: 60 * 60,   // optional: refresh token every 1 hour
  },  
  callbacks: {
    async signIn({ user }) {
      const dbUser = await prisma.user.findUnique({
        where: { username: user.username },
      });

      if (dbUser) {
        user.twoFactorEnabled = dbUser.twoFactorEnabled;
      }

      return true;
    },

    async jwt({ token, user,trigger,session }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.twoFactorEnabled = user.twoFactorEnabled ?? false;
        token.twoFactorVerified = user.twoFactorVerified || false;
        token.role = user.role;
        token.statut = user.statut;
      }
      if(trigger === "update"){
          token.twoFactorVerified = session.twoFactorVerified;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.twoFactorEnabled = token.twoFactorEnabled;
      session.user.twoFactorVerified = token.twoFactorVerified;
      session.user.role = token.role;
      session.user.statut = token.statut;
      return session;
    },
  },
};
