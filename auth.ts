import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/nodemailer';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import {pool} from '@/app/lib/db/pool';
import {prisma} from "@/app/lib/prisma/database";
import CustomPrismaAdapter from "@/prisma/custom-prisma-adapter";
import {customVerificationRequest} from '@/app/lib/auth/customVerificationRequest'

async function getUsers(email:string) {
  try {
    const [result, fileds] = await pool.query(`SELECT * FROM users WHERE email="${email}"`);
    return result[0];
  } catch (error) {
      console.log('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
  }
}
 
export const { handlers: {GET, POST}, auth, signIn, signOut } = NextAuth((req) => {

  //console.log('req object');
  //console.dir(req, { depth: null, colors: true });

  return {
    ...authConfig,
    adapter: CustomPrismaAdapter(prisma),
    session: {strategy: "jwt"},
    pages: {
      signIn: '/login'
    },
    providers: [
      Credentials({
        name: 'Maestro Auth',
        async authorize(credentials) {

          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

            if (parsedCredentials.success) {
              const { email, password } = parsedCredentials.data;
              const user = await getUsers(email);
              if (!user) return null;
              const passwordsMatch = await bcrypt.compare(password, user.pwd);
              const sessionUser = {
                name: user.name,
                email: user.email,
                role: 'MaestroTeam'
              };
              if (passwordsMatch) return sessionUser; 
            }

            console.log('Invalid credentials')
            return null;
        },
      }),
      EmailProvider({
        id: 'email',
        name: 'email',
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD
          }
        },
        from: process.env.EMAIL_FROM,
        sendVerificationRequest(params) {
          console.log('params for the sendVerificationRequest function',params);
          customVerificationRequest(params);
        }
      })
    ]
  }
});