import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMe } from "@/features/auth/api/get-me";
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from "@/services/storage/token-storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    async function bootstrapAuth() {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const response = await getMe();
        const resolvedUser = response?.data || response?.user || response || null;

        if (resolvedUser) {
          setUser(resolvedUser);
          setStoredUser(resolvedUser);
        }
      } catch {
        clearAuthStorage();
        setToken(null);
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    }

    bootstrapAuth();
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isBootstrapping,
      login: ({ token: nextToken, user: nextUser }) => {
        setToken(nextToken);
        setUser(nextUser || null);
        setStoredToken(nextToken);

        if (nextUser) {
          setStoredUser(nextUser);
        }
      },
      logout: () => {
        clearAuthStorage();
        setToken(null);
        setUser(null);
      },
      setUser,
    }),
    [token, user, isBootstrapping],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
