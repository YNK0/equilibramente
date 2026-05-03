'use client';

import { useCallback, useEffect, useState } from 'react';
import { profileService } from '../services/profile-service';
import type { Profile, ProfileStats, ProfileUpdateInput } from '../types';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [p, s] = await Promise.all([profileService.get(), profileService.getStats()]);
      setProfile(p);
      setStats(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const update = useCallback(async (input: ProfileUpdateInput) => {
    const updated = await profileService.update(input);
    setProfile(updated);
    return updated;
  }, []);

  return { profile, stats, loading, error, update, refetch: fetch };
}
