import React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

const readStoredUser = (key) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
};

export const AuthProvider = ({ children }) => {
  const [passengerUser, setPassengerUser] = useState(() => readStoredUser("nta_passenger_user"));
  const [adminUser, setAdminUser] = useState(() => readStoredUser("nta_admin_user"));
  const [passengerToken, setPassengerToken] = useState(() => localStorage.getItem("nta_passenger_token"));
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("nta_admin_token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (passengerToken) {
      localStorage.setItem("nta_passenger_token", passengerToken);
    } else {
      localStorage.removeItem("nta_passenger_token");
    }
  }, [passengerToken]);

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("nta_admin_token", adminToken);
    } else {
      localStorage.removeItem("nta_admin_token");
    }
  }, [adminToken]);

  useEffect(() => {
    if (passengerUser) {
      localStorage.setItem("nta_passenger_user", JSON.stringify(passengerUser));
    } else {
      localStorage.removeItem("nta_passenger_user");
    }
  }, [passengerUser]);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem("nta_admin_user", JSON.stringify(adminUser));
    } else {
      localStorage.removeItem("nta_admin_user");
    }
  }, [adminUser]);

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", payload);
      if (data.user.role === "admin") {
        setAdminToken(data.token);
        setAdminUser(data.user);
      } else {
        setPassengerToken(data.token);
        setPassengerUser(data.user);
      }
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      setPassengerToken(data.token);
      setPassengerUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = (role = "passenger") => {
    if (role === "admin") {
      setAdminToken(null);
      setAdminUser(null);
      return;
    }

    setPassengerToken(null);
    setPassengerUser(null);
  };

  const value = useMemo(
    () => ({
      adminToken,
      adminUser,
      isAdminAuthenticated: Boolean(adminToken),
      isAuthenticated: Boolean(passengerToken),
      isPassengerAuthenticated: Boolean(passengerToken),
      loading,
      login,
      logout,
      passengerToken,
      passengerUser,
      register,
      token: passengerToken,
      user: passengerUser
    }),
    [adminToken, adminUser, loading, passengerToken, passengerUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
