/**
 * Utility helper to handle local simulation state with fallback and reactive event dispatching.
 * When Firebase is integrated in Phase 2, this layer will be replaced with Firestore real-time listeners.
 */

// One-time cleanup to ensure old dummy data from previous runs is purged
if (typeof window !== 'undefined') {
  try {
    const versionKey = 'caresync_storage_version';
    if (localStorage.getItem(versionKey) !== 'v2_no_dummy') {
      localStorage.removeItem('caresync_gov_hospitals');
      localStorage.removeItem('caresync_gov_complaints');
      localStorage.removeItem('caresync_gov_announcements');
      localStorage.removeItem('caresync_gov_staff');
      localStorage.removeItem('caresync_gov_activity_logs');
      localStorage.removeItem('caresync_gov_district_capacity');
      localStorage.setItem(versionKey, 'v2_no_dummy');
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

export function getStoredData<T>(key: string, initialData: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`[CareSync Storage] Error reading key "${key}", falling back to initial data.`, error);
    return initialData;
  }
}

export function setStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(`caresync:update:${key}`, { detail: data }));
  } catch (error) {
    console.error(`[CareSync Storage] Error writing key "${key}".`, error);
  }
}

export function subscribeToDataKey<T>(key: string, callback: (data: T) => void): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<T>;
    callback(customEvent.detail);
  };
  window.addEventListener(`caresync:update:${key}`, handler);
  return () => {
    window.removeEventListener(`caresync:update:${key}`, handler);
  };
}

export function clearAllPortalData(): void {
  try {
    localStorage.removeItem('caresync_gov_hospitals');
    localStorage.removeItem('caresync_gov_complaints');
    localStorage.removeItem('caresync_gov_announcements');
    localStorage.removeItem('caresync_gov_staff');
    localStorage.removeItem('caresync_gov_activity_logs');
    localStorage.removeItem('caresync_gov_district_capacity');
    window.location.reload();
  } catch (e) {
    console.error('Failed to clear data', e);
  }
}
