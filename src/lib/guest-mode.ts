'use client';

const GUEST_KEY = 'equilibramente:guest_mode';

export function isGuest(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(GUEST_KEY) === 'true';
}

export function enterGuest(): void {
  sessionStorage.setItem(GUEST_KEY, 'true');
  // Cookie for middleware — expires in 7 days, not HttpOnly so JS can also read
  document.cookie = `equilibramente-guest=true; path=/; max-age=604800; SameSite=Lax`;
}

export function exitGuest(): void {
  sessionStorage.removeItem(GUEST_KEY);
  sessionStorage.removeItem('equilibramente:guest_data');
  document.cookie = 'equilibramente-guest=; path=/; max-age=0';
}
