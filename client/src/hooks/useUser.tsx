/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  getUserLocal,
  removeAuthToken,
  removeUser,
  setAuthToken,
  setUserLocal,
  User,
} from "../utils/api";

interface UserContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = getUserLocal();
    return storedUser;
  });

  const login = (user: User, token: string) => {
    setUser(user);
    setUserLocal(user);
    setAuthToken(token);
  };

  const logout = () => {
    setUser(null);
    removeUser();
    removeAuthToken();
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
