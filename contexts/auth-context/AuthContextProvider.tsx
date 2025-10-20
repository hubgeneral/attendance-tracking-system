import React, { useState } from "react";
import type { AuthContextType, AuthProviderProps } from "../../types/authTypes";
import AuthContext from "./AuthContext";

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authContextData, setAuthContextData] = useState<AuthContextType>({
    currentUser: undefined,
  });

  const value = {
    authContextData,
    setAuthContextData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
