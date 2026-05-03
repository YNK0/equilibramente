'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirmed = searchParams.get('confirmed');
  const [status, setStatus] = useState<'loading' | 'confirmed' | 'redirecting' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const supabase = createClient();

    if (confirmed === 'true') {
      setStatus('confirmed');
      return;
    }

    // Poll for session — Supabase auto-processes the hash fragment
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(async () => {
      attempts++;
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        clearInterval(interval);
        setStatus('redirecting');
        router.push('/');
        router.refresh();
        return;
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setStatus('redirecting');
        // Redirect anyway — middleware will handle redirect to login if no session
        router.push('/');
        router.refresh();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [router, confirmed]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-purple-50/30 px-4">
      <div className="w-full max-w-sm text-center">
        {status === 'confirmed' ? (
          <>
            <div className="text-4xl mb-4">&#10004;</div>
            <h1 className="text-xl font-bold text-green-600">Correo confirmado</h1>
            <p className="mt-2 text-sm text-gray-500">
              Tu cuenta esta activa. Ya puedes iniciar sesion.
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="mt-6 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors"
            >
              Ir a iniciar sesion
            </button>
          </>
        ) : status === 'error' ? (
          <>
            <div className="text-4xl mb-4">&#10060;</div>
            <h1 className="text-xl font-bold text-gray-900">Error de autenticacion</h1>
            <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-4 animate-pulse">&#129504;</div>
            <h1 className="text-xl font-bold text-gray-900">
              {status === 'redirecting' ? 'Redirigiendo...' : 'Verificando identidad...'}
            </h1>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-purple-50/30 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-4xl mb-4 animate-pulse">&#129504;</div>
          <h1 className="text-xl font-bold text-gray-900">Cargando...</h1>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
