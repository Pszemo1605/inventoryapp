import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 60 * 10
    },
    pages: {
        signIn: "/signin"
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Your email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<User | null> {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }
                const existingUser = await db.user.findUnique({
                    where: {
                        email: credentials?.email
                    }
                })

                if (!existingUser) {
                    return null
                }

                const passwordMatch = await compare(credentials.password, existingUser.password);

                if (!passwordMatch) {
                    return null
                }

                const username = existingUser.username || ""

                return {
                    id: `${existingUser.id}`,
                    username: username,
                    email: existingUser.email
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    username: user.username,
                    id: token.id
                }
            }
            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username,
                    id: token.sub
                }
            }
        }
    }
}