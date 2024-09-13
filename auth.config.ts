import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
    callbacks: {
        async jwt({ token, user }) {
            user && (token.user = user);
            return token
        },
        async session({ session, token }) {
            session.user = token.user;
            return session
        },
        async authorized({ auth, request: {nextUrl}}) {

            const isMaestroMember = auth?.user?.role == 'MaestroTeam';
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnClient = nextUrl.pathname.startsWith('/client');
            
            // I would expect the Role-based authorization to happen over here. Pero i fail
            // to use db connectors due to the incompatibility with the Edge Runtime. Additionaly
            // the docs and forum folks suggest perform the authorization directly on the pages
            
            if (isOnDashboard) {
                if (isMaestroMember) return true;
                return false;
            } else if (isOnClient) {
                return true
            } else if (isMaestroMember) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig