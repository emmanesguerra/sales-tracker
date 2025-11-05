import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/modules/auth/store/authStore'

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    // Mock localStorage
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
  });

  it('should set token and store it in localStorage', () => {
    const authStore = useAuthStore();

    const token = 'test-token';
    authStore.setToken(token);

    expect(authStore.token).toBe(token);
    expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', token);
  });

  it('should clear token and remove it from localStorage', () => {
    const authStore = useAuthStore();

    authStore.setToken('test-token');
    authStore.clearToken();

    expect(authStore.token).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
  });
});
