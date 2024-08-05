import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import {pool} from '@/app/lib/db/pool'

async function getUsers(email:string) {
  try {
    const [result, fileds] = await pool.query(`SELECT * FROM users WHERE email="${email}"`);
    return result[0];
  } catch (error) {
      console.log('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const user = await getUsers(email);
            console.log('User', user);
            if (!user) return null;
            const passwordsMatch = await bcrypt.compare(password, user.pwd);
            if (passwordsMatch) return user; 
          }

          console.log('Invalid credentials')
          return null;
      },
    }),
  ],
});