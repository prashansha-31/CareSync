import { getStoredData, setStoredData, subscribeToDataKey } from './storageHelper';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  badgeId: string;
  department: string;
  isDemoSession: boolean;
}

const AUTH_KEY = 'caresync_gov_auth_session';

export const authService = {
  getCurrentUser(): AdminUser | null {
    // If not logged in, return null
    return getStoredData<AdminUser | null>(AUTH_KEY, null);
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },

  async login(email: string, _password?: string, rememberMe = true): Promise<AdminUser> {
    if (!email || !email.includes('@')) {
      throw new Error('Please provide a valid official government or administrative email address.');
    }

    const derivedName = email
      .split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const user: AdminUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: derivedName || 'Admin Officer',
      email,
      role: 'Government Administrator',
      badgeId: `GOV-${Date.now().toString().slice(-4)}`,
      department: 'Health & Family Welfare Directorate',
      isDemoSession: true,
    };

    if (rememberMe) {
      setStoredData(AUTH_KEY, user);
    } else {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
      setStoredData(AUTH_KEY, user);
    }

    return user;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new CustomEvent(`caresync:update:${AUTH_KEY}`, { detail: null }));
  },

  subscribe(callback: (user: AdminUser | null) => void): () => void {
    return subscribeToDataKey(AUTH_KEY, callback);
  },
};
