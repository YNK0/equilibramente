'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/modules/shared/components/layout/app-shell';
import { MoodPicker } from '@/modules/emotional/components/mood-picker';
import { MoodStateBanner } from '@/modules/emotional/components/mood-state-banner';
import { OnboardingFlow } from '@/modules/emotional/components/onboarding-flow';
import { emotionalService } from '@/modules/emotional/services/emotional-service';
import { PageLoading } from '@/modules/shared/components/ui/loading';
import type { EmotionalCheckin } from '@/modules/emotional/types';

export default function CheckinPage() {
  const router = useRouter();
  const [todayCheckin, setTodayCheckin] = useState<EmotionalCheckin | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const checkin = await emotionalService.getToday();
        setTodayCheckin(checkin);
        // Check onboarding flag from localStorage
        const completed = localStorage.getItem('onboarding_completed');
        if (!completed) setShowOnboarding(true);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const handleCheckinComplete = () => {
    router.push('/');
    router.refresh();
  };

  const handleChange = () => {
    setTodayCheckin(null);
  };

  if (loading) return <AppShell title="Check-in"><PageLoading /></AppShell>;

  if (showOnboarding) {
    return (
      <AppShell title="Bienvenido">
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </AppShell>
    );
  }

  return (
    <AppShell title="Check-in">
      {todayCheckin ? (
        <MoodStateBanner checkin={todayCheckin} onChange={handleChange} />
      ) : null}
      {!todayCheckin && <MoodPicker onComplete={handleCheckinComplete} />}
    </AppShell>
  );
}
