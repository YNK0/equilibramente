import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { data: null, error: { code: 'AUTH_REQUIRED', message: 'Inicia sesión para continuar' } },
      { status: 401 }
    );

  const { data: audios, error } = await supabase
    .from('audio_resources')
    .select('*')
    .eq('is_active', true)
    .order('category');

  if (error)
    return NextResponse.json(
      { data: null, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );

  const audioList = await Promise.all(
    (audios ?? []).map(async (audio) => {
      const { data: signed } = await supabase.storage
        .from('audio-resources')
        .createSignedUrl(audio.storage_path, 3600);
      return { ...audio, audio_url: signed?.signedUrl ?? null };
    })
  );

  return NextResponse.json({ data: audioList, error: null });
}
