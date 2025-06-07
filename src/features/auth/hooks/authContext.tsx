import React, { createContext, useState, useContext, useEffect } from "react";
import { useProfile } from "./useprofile";
import type { UserType, AuthContextType } from "../types/auth.shema";

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, refetch, isLoading, error } = useProfile();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const hasToken = document.cookie.includes("feAccessToken=");
    if (hasToken) {
      refetch();
    }
  }, []);

  useEffect(() => {
    if (data)
      setUser(data.data); // API trả về user trực tiếp, không phải data.user
    else setUser(null);
  }, [data]);
  useEffect(() => {
    if (error) setUser(null);
  }, [error]);
  return (
    <AuthContext.Provider value={{ user, loading: isLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
