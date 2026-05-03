'use client';

import { useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el enlace');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-purple-50/30 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-4xl mb-4">&#9993;</div>
          <h1 className="text-xl font-bold text-gray-900">Revisa tu correo</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enviamos un enlace magico a <strong>{email}</strong>. Abrelo para iniciar sesion.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-6 text-sm text-purple-600 hover:text-purple-700"
          >
            Usar otro correo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-purple-50/30 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">&#129504;</div>
          <h1 className="text-2xl font-bold text-gray-900">EquilibraMente</h1>
          <p className="mt-1 text-sm text-gray-500">
            Autorregulacion y bienestar para universitarios
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo universitario
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@universidad.edu"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
              autoComplete="email"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Enviando...' : 'Enviar enlace magico'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Primera vez?{' '}
          <Link href="/auth/register" className="text-purple-600 hover:text-purple-700 font-medium">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
