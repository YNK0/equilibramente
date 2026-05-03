'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Achievement } from '../types';

const supabase = createClient();

export function CelebrationOverlay() {
  const [latest, setLatest] = useState<Achievement | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel('achievements')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_achievements' },
        async (payload) => {
          const { data } = await supabase
            .from('achievements')
            .select('*')
            .eq('id', (payload.new as Record<string, string>).achievement_id)
            .single();

          if (data) {
            setLatest({
              ...data,
              requirement: data.requirement as Record<string, unknown>,
              unlocked: true,
              unlocked_at: (payload.new as Record<string, string>).unlocked_at,
              progress: null,
              category: data.category,
              tier: data.tier,
            });

            if (navigator.vibrate) {
              navigator.vibrate([50, 100, 50, 100, 100]);
            }

            setTimeout(() => setLatest(null), 5000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AnimatePresence>
      {latest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        >
          <motion.div
            initial={{ scale: 0.5, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="bg-white rounded-3xl p-8 text-center mx-4 max-w-sm w-full"
          >
            <span className="text-7xl block mb-4">{latest.icon}</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">¡Logro desbloqueado!</h2>
            <h3 className="text-lg font-semibold text-purple-600 mb-2">{latest.title}</h3>
            <p className="text-sm text-gray-600 mb-6">{latest.description}</p>
            <button
              onClick={() => setLatest(null)}
              className="px-8 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
            >
              Continuar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
