import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

    const path = request.nextUrl.pathname;
    // console.log("NextURL", request.nextUrl);

    const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail';

    const token = request.cookies.get('token')?.value || ""
    // console.log("Next cookie Token", request.cookies.get('token'));

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/profile', request.nextUrl))
    }
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
        '/profile',
        '/login',
        '/signup',
        '/verifyemail'
    ]


}

