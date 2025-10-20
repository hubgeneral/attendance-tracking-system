import type { AuthContextType } from "@/types/authTypes";
import { createContext, type Dispatch } from "react";

const authContextData: AuthContextType = {
  currentUser: undefined,
};

const AuthContext = createContext<{
  authContextData: AuthContextType | undefined;
  setAuthContextData?:
    | Dispatch<React.SetStateAction<AuthContextType>>
    | undefined;
  getLoggedInUser?: (email: string) => void;
  resetAuthContext?: (email: string) => void;
}>({ authContextData });

export default AuthContext;
