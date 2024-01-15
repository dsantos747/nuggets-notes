import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User as DbUser } from '@/app/lib/types'; // To avoid confusion with type User from NextAuth
// import type { User } from 'next-auth';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable could not be resolved.');
}

const sql = postgres(databaseUrl, { ssl: 'require' });

async function getUser(email: string): Promise<DbUser | undefined> {
  try {
    const users: DbUser[] = await sql`SELECT * FROM users WHERE email=${email}`;
    return users[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z.object({ email: z.string().email(), password: z.string().min(6) }).safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password_hashed);
          if (passwordsMatch) {
            // const formattedUser: User = { id: user.id, name: user.name, email: user.email, image: null };
            // return formattedUser;
            return user;
          }
        }
        console.log('Invalid Credentials');
        return null;
      },
    }),
  ],
});
