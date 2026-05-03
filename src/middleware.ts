import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/types/database';
import { rateLimit } from '@/lib/rate-limit';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Rate limit API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const { allowed, remaining } = rateLimit(ip);

    res.headers.set('X-RateLimit-Remaining', String(remaining));

    if (!allowed) {
      return NextResponse.json(
        { data: null, error: { code: 'RATE_LIMITED', message: 'Demasiadas solicitudes. Espera un momento.' } },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
  }

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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Public routes
  const publicPaths = ['/auth'];
  const isPublic = publicPaths.some((p) => req.nextUrl.pathname.startsWith(p));
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sw.js|icons/|illustrations/).*)'],
};
