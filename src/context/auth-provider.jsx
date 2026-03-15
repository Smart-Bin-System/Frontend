import { useEffect, useMemo, useState } from "react";
import { getMe } from "@/features/auth/api/get-me";
import { AUTH_EXPIRED_EVENT } from "@/lib/axios";
import { getPermissionsForRole, normalizeRole } from "@/lib/rbac";
import { AuthContext } from "@/context/auth-context";
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from "@/services/storage/token-storage";

function normalizeUser(user) {
  if (!user) return null;

  const normalizedRole = normalizeRole(user.role);

  return {
    ...user,
    role: normalizedRole,
    permissions: user.permissions?.length
      ? user.permissions
      : getPermissionsForRole(normalizedRole),
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => normalizeUser(getStoredUser()));
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    async function bootstrapAuth() {
      const existingToken = getStoredToken();

      if (!existingToken) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const response = await getMe();
        const resolvedUser = normalizeUser(response?.user || response || null);

        if (!resolvedUser) {
          throw new Error("No user returned from /auth/me");
        }

        setToken(existingToken);
        setUser(resolvedUser);
        setStoredUser(resolvedUser);
      } catch {
        clearAuthStorage();
        setToken(null);
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    }

    bootstrapAuth();
  }, []);

  useEffect(() => {
    function handleAuthExpired() {
      clearAuthStorage();
      setToken(null);
      setUser(null);
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isBootstrapping,
      login: ({ token: nextToken, user: nextUser }) => {
        const normalizedUser = normalizeUser(nextUser);

        setToken(nextToken);
        setUser(normalizedUser);
        setStoredToken(nextToken);
        setStoredUser(normalizedUser);
      },
      logout: () => {
        clearAuthStorage();
        setToken(null);
        setUser(null);
      },
      setUser: (nextUser) => {
        const normalizedUser = normalizeUser(nextUser);
        setUser(normalizedUser);
        setStoredUser(normalizedUser);
      },
    }),
    [token, user, isBootstrapping],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
