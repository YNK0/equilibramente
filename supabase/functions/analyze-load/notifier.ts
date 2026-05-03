// Notifier — Realtime broadcast + push notifications for critical load

import type { LoadResult, Recommendation } from './types.ts';

interface SupabaseClient {
  channel(name: string): {
    send(data: Record<string, unknown>): Promise<void>;
  };
  from(table: string): {
    select(columns: string): {
      eq(column: string, value: string): {
        single(): Promise<{ data: NotificationPrefs | null; error: Error | null }>;
      };
    };
  };
}

interface NotificationPrefs {
  stress_alert: boolean;
  push_subscription: Record<string, unknown> | null;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
}

export async function notifyUser(
  supabase: SupabaseClient,
  userId: string,
  result: LoadResult,
  recommendations: Recommendation[]
): Promise<void> {
  // 1. Realtime broadcast for live UI updates
  try {
    await supabase
      .channel(`user:${userId}:analysis`)
      .send({
        type: 'broadcast',
        event: 'analysis_updated',
        payload: { level: result.level, score: result.score },
      });
  } catch {
    // Non-critical: broadcast failure shouldn't block the analysis
  }

  // 2. Push notification only for critical load
  if (result.level !== 'critical') return;

  try {
    const { data: prefs } = await supabase
      .from('notification_preferences')
      .select('stress_alert, push_subscription, quiet_hours_start, quiet_hours_end')
      .eq('user_id', userId)
      .single();

    if (!prefs?.stress_alert || !prefs?.push_subscription) return;

    // Check quiet hours
    if (prefs.quiet_hours_start && prefs.quiet_hours_end) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const startMinutes = parseTimeToMinutes(prefs.quiet_hours_start);
      const endMinutes = parseTimeToMinutes(prefs.quiet_hours_end);
      if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) return;
    }

    // Send push via Web Push API
    const topRec = recommendations[0];
    await sendPush(prefs.push_subscription, {
      title: 'Nivel de carga: Critico',
      body: topRec
        ? topRec.title
        : 'Podrias saturarte. Toca para ver recomendaciones.',
      tag: 'load_alert',
      data: { screen: '/analisis' },
    });
  } catch {
    // Non-critical: push failure shouldn't block the analysis
  }
}

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

async function sendPush(
  subscription: Record<string, unknown>,
  message: {
    title: string;
    body: string;
    tag: string;
    data: Record<string, string>;
  }
): Promise<void> {
  // Web Push API send — uses the stored push subscription
  // In production, this would call the Web Push service
  // For now, log for debugging
  console.log('[notifyUser] Push notification:', message.title);
}
