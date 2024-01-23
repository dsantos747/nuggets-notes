import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnNotespace = nextUrl.pathname.startsWith('/notespace');
      const isOnSettings = nextUrl.pathname.startsWith('/settings');
      if (isOnNotespace || isOnSettings) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/notespace', nextUrl));
      }
      return true;
    },
    async session({ session, user, token }) {
      if (token?.sub) {
        if (session.user) {
          session.user = {
            id: token.sub,
            name: token.name,
            email: token.email,
            image: token.picture,
            // id: session.user.id,
          };
        }
      }
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
