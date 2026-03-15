import { STORAGE_KEYS } from "@/constants/storage-keys";

export function getStoredToken() {
  return localStorage.getItem(STORAGE_KEYS.authToken);
}

export function setStoredToken(token) {
  localStorage.setItem(STORAGE_KEYS.authToken, token);
}

export function removeStoredToken() {
  localStorage.removeItem(STORAGE_KEYS.authToken);
}

export function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.authUser);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
}

export function removeStoredUser() {
  localStorage.removeItem(STORAGE_KEYS.authUser);
}

export function clearAuthStorage() {
  removeStoredToken();
  removeStoredUser();
}
