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
  const { data, refetch, error } = useProfile();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasToken =
      document.cookie.includes("feAccessToken=") ||
      localStorage.getItem("accessToken");

    if (hasToken) {
      setUser(null); // reset user
      (async () => {
        try {
          const response = await refetch(); // gọi refetch và chờ kết quả
          if (response?.data?.data) {
            setUser(response.data.data);
          } else {
            setUser(null);
          }
        } catch (err) {
          setUser(null);
        } finally {
          setLoading(false); // chỉ set loading false sau khi có kết quả
        }
      })();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
    } else if (error) {
      setUser(null);
    }
  }, [data, error]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
