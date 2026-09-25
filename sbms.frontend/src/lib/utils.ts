import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface JwtPayload {
  userId: string;
  role: string;
  exp?: number;
}

export function parseJwtToken(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);

    const userId =
      parsed.userId ||
      parsed.nameid ||
      parsed.sub ||
      parsed['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
      '';

    const role =
      parsed.role ||
      parsed['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      '';

    return { userId, role, exp: parsed.exp };
  } catch (err) {
    console.error('Failed to parse JWT token:', err);
    return null;
  }
}
