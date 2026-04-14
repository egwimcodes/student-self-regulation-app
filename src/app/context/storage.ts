const EXPIRES_DAYS = 365;

function expires(): string {
  const d = new Date();
  d.setTime(d.getTime() + EXPIRES_DAYS * 24 * 60 * 60 * 1000);
  return d.toUTCString();
}

export function setCookie(key: string, value: unknown): void {
  document.cookie = `${key}=${encodeURIComponent(JSON.stringify(value))};expires=${expires()};path=/;SameSite=Lax`;
}

export function getCookie<T>(key: string): T | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${key}=`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split('=').slice(1).join('='))) as T;
  } catch {
    return null;
  }
}

export function removeCookie(key: string): void {
  document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

export function clearAllCookies(): void {
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, `=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`);
  });
}
