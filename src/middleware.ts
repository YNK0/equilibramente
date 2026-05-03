import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            res.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Public routes
  const publicPaths = ['/auth'];
  const isPublic = publicPaths.some(p => req.nextUrl.pathname.startsWith(p));
  if (isPublic) return res;

  // API routes handle auth themselves
  if (req.nextUrl.pathname.startsWith('/api/auth')) return res;

  // Redirect to login if no session
  if (!session) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('returnUrl', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sw.js|icons/|illustrations/).*)',
  ],
};
