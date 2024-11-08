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
            const isOnAssembly = nextUrl.pathname.startsWith('/assembly');
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnClient = nextUrl.pathname.startsWith('/client');
            const isOnTenderPackage = nextUrl.pathname.startsWith('/tenderpackage');

            console.log(`Is the user on the TenderPackage? ${isOnTenderPackage}. Is he a Maestro Member? ${isMaestroMember}`)
            
            // I would expect the Role-based authorization to happen over here. Pero i fail
            // to use db connectors due to the incompatibility with the Edge Runtime. Additionaly
            // the docs and forum folks suggest perform the authorization directly on the pages
            
            if (isOnDashboard) {
                if (isMaestroMember) return true;
                return false;
            } else if (isOnClient) {
                return true
            }  else if (isOnTenderPackage) {
                if (isMaestroMember) return true;
                return false;
            } else if (isOnAssembly) {
                return true;
            } else if (isMaestroMember) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig