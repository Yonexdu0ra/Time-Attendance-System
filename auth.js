
export const runtime = "nodejs";
import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcrypt'
import { loginCredentialsSchema } from "./schema/loginCredentialsSchema";
class CustomError extends CredentialsSignin {
  constructor(message = "Thông tin đăng nhập không hợp lệ") {
    super(message);
    this.code = message;
  }
}

const config = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // cấu hình tự động refresh token
      authorization: {
        params: { access_type: "offline", prompt: "consent", response_type: "code" },
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {

        try {
          const { email, password } = credentials;
          const parsedData = await loginCredentialsSchema.safeParseAsync(credentials);
          if (!parsedData.success) {
            const errors = parsedData.error.issues.map(err => err.message).join(", ");
            throw new Error(errors);
          }
          const user = await prisma.user.findUnique({
            where: { email },
          });


          if (!user) throw new Error("Người dùng không tồn tại");
          const isPasswordValid = await bcrypt.compare(password || "", user.password || "");
          if (!isPasswordValid) {
            throw new Error("Mật khẩu không chính xác");
          }
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          }
        } catch (error) {
          // console.log(error.message);
          throw new CustomError(error.message);
        }
      }
    })
  ],

  callbacks: {

    async jwt({ token, account, profile, user }) {
      if (account && profile) {
        token.user = {
          id: profile.sub ?? profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      }
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
}


export const { handlers, signIn, signOut, auth } = NextAuth(config);
