import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, user }) {
            user && (token.user = user);
            return token
        },
        async session({ session, token }) {
            session.user = token.user;
            return session
        },
        authorized({ auth, request: {nextUrl}}) {

            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnClientPage = nextUrl.pathname.startsWith('/client');
            const isOnViewerTokenPage = nextUrl.pathname.startsWith('/pages/api/viewertoken');
            const isOnAutodeskPage = nextUrl.pathname.startsWith('/autodesk'); // temp
            
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false;
            } else if (isOnClientPage) {
                return true;
            } else if(isOnViewerTokenPage) {
                return true;
            } else if(isOnAutodeskPage) {
                return true;
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig