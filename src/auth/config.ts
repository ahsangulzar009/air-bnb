import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from "next-auth"
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from "@/lib/prisma"

const signInSchema = z.object({
  name: z.string().optional(),
  email: z.string().min(1, "Email is required").pipe(z.email({ message: "Invalid email address" })),
  password: z.string().min(8, "Password be at least 8 character")
})

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' as const },
  pages: {
    signIn: '/login'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { name, email, password } = parsed.data;
        const normalizedEmail = email.toLowerCase().trim();
        const isSignUpAttempt = name && name.trim().length >= 2;

        const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });

        if (isSignUpAttempt) {
          if (existingUser) return null;

          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await prisma.user.create({
            data: {
              name: name.trim(),
              email: normalizedEmail,
              hashedPassword
            }
          });

          const { hashedPassword: _, ...safeUser } = newUser;
          return safeUser;
        }

        if (!existingUser || !existingUser.hashedPassword) {
          console.log("❌ No user or no password hash");
          return null;
        }

        const isValid = await bcrypt.compare(password, existingUser.hashedPassword);
        if (!isValid) return null;

        const { hashedPassword: _, ...safeUser } = existingUser;
        return safeUser;
      },

    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email
        session.user.name = token.name
        session.user.image = token.picture
      }
      return session
    }

  }
}

