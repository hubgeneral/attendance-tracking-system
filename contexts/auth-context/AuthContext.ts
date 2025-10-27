import type { AuthContextType } from "@/types/authTypes";
import { createContext, type Dispatch } from "react";

interface AuthContextValueType {
  authContextData: AuthContextType;
  setAuthContextData: Dispatch<React.SetStateAction<AuthContextType>>;
}

const AuthContext = createContext<AuthContextValueType | undefined>(undefined);

export default AuthContext;
