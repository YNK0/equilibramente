'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const supabase = createClient();

    // The hash fragment contains the auth tokens from magic link
    // Supabase client automatically handles the hash exchange
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/');
        router.refresh();
      }
    });

    // Also check if already have a session (hash already processed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/');
        router.refresh();
      }
    });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-purple-50/30 px-4">
      <div className="w-full max-w-sm text-center">
        {error ? (
          <>
            <div className="text-4xl mb-4">&#10060;</div>
            <h1 className="text-xl font-bold text-gray-900">Error de autenticacion</h1>
            <p className="mt-2 text-sm text-red-600">{error}</p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-4 animate-pulse">&#129504;</div>
            <h1 className="text-xl font-bold text-gray-900">Iniciando sesion...</h1>
            <p className="mt-2 text-sm text-gray-500">Verificando tu identidad</p>
          </>
        )}
      </div>
    </div>
  );
}
