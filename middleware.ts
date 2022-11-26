import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
        
    const session: any = await getToken({ req, secret: process.env.NEXTAHUT_SECRET });
    // console.log('Session:',session);  

    const validRoles = ['admin', 'super-user', 'SEO'];

    if (req.nextUrl.pathname.startsWith("/checkout")) {                                      
        if (!session) {
            const { protocol, host, pathname } = req.nextUrl;
            return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`);
        }

        return NextResponse.next();
    }   

    if (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/api/admin")) {      
        if (!session) {
            const { protocol, host, pathname } = req.nextUrl;                       
            return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`);
        }
        
        if (!validRoles.includes(session.user.role)) {
            const url = req.nextUrl.clone();             
            return NextResponse.redirect(url.origin);
        }

        return NextResponse.next();
    }      
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/checkout/:path*',
        '/admin/:path*', 
        '/api/admin/:path*'
    ],
};