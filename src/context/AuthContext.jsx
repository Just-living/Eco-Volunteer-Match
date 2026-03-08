import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(localStorage.getItem("evm_token") || "");
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  function setToken(tokenValue) {
    const t = tokenValue || "";
    setTokenState(t);

    if (t) localStorage.setItem("evm_token", t);
    else localStorage.removeItem("evm_token");

    api.setToken(t);
  }

  async function refreshMe() {
    try {
      const user = await api.getMe();
      setMe(user);
      return user;
    } catch (error) {
      const status = error?.response?.status;

      if (status === 401) {
        setToken("");
        setMe(null);
        return null;
      }

      throw error;
    }
  }

  useEffect(() => {
    (async () => {
      try {
        api.setToken(token);
        if (token) await refreshMe();
      } catch (error) {
        console.error("Failed to refresh user:", error?.response?.data || error?.message || error);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email, password) {
    const res = await api.login(email, password);
    setToken(res.token);
    setMe(res.user);
    return res.user;
  }

  async function register(payload) {
    const res = await api.register(payload);
    setToken(res.token);
    setMe(res.user);
    return res.user;
  }

  function logout() {
    setToken("");
    setMe(null);
  }

  const value = useMemo(
    () => ({ token, me, loading, login, register, logout, refreshMe, setMe }),
    [token, me, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
