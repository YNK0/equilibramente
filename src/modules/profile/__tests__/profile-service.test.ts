import { describe, expect, it } from 'vitest';
import { profileService } from '../services/profile-service';

describe('profileService', () => {
  it('has all expected methods', () => {
    expect(typeof profileService.get).toBe('function');
    expect(typeof profileService.update).toBe('function');
    expect(typeof profileService.getNotificationPrefs).toBe('function');
    expect(typeof profileService.updateNotificationPrefs).toBe('function');
    expect(typeof profileService.subscribePush).toBe('function');
    expect(typeof profileService.unsubscribePush).toBe('function');
    expect(typeof profileService.getStats).toBe('function');
    expect(typeof profileService.uploadAvatar).toBe('function');
  });
});
