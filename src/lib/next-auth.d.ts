/* eslint-disable @typescript-eslint/no-unused-vars */ 
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?:string;
      prenom?:string;
      username?: string; // Add username here
      twoFactorEnabled: boolean;
      twoFactorVerified: boolean;
      role:string;
      statut?:boolean;
    } & DefaultSession["user"];
  }
  
  interface User extends DefaultUser {
    id: string;
    name?:string;
    prenom?:string;
    username?: string; // Add username here
    twoFactorEnabled: boolean;
    twoFactorVerified?: boolean;
    role:string;
    statut?:boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?:string;
    prenom?:string;
    username?: string; // Add username here
    twoFactorEnabled: boolean;
    twoFactorVerified: boolean;
    role:string;
    statut?:boolean;
  }
}
