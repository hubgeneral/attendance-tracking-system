import type { UserLoginResponse } from "@/src/generated/graphql";
import type { ReactNode } from "react";

interface AuthContextType {
  currentUser?: UserLoginResponse | undefined;
}

interface AuthProviderProps {
  children: ReactNode;
}

export type { AuthContextType, AuthProviderProps };
