import AuthContext from "@/contexts/auth-context/AuthContext";
import {
  useLoginMutation,
  type UserLoginResponse,
} from "@/src/generated/graphql";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useContext, useEffect, useState } from "react";

interface LoginCredentials {
  employeeId: string;
  password: string;
}

interface UseAuthProps {
  currentUser: UserLoginResponse | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setAuthData: (user: UserLoginResponse, accessToken: string) => void;
  updateUser: (user: UserLoginResponse) => void;
  updateAccessToken: (accessToken: string) => void;
}

// AsyncStorage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  CURRENT_USER: "currentUser",
};

export const useAuth = (): UseAuthProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { authContextData, setAuthContextData } = context;
  const isAuthenticated = Boolean(authContextData?.currentUser);
  const [isLoading, setIsLoading] = useState(true);
  const [loginMutation] = useLoginMutation();

  // Load auth data from AsyncStorage on mount
  useEffect(() => {
    const loadAuthFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(
          STORAGE_KEYS.CURRENT_USER
        );
        const storedAccessToken = await AsyncStorage.getItem(
          STORAGE_KEYS.ACCESS_TOKEN
        );
        const storedRefreshToken = await AsyncStorage.getItem(
          STORAGE_KEYS.REFRESH_TOKEN
        );

        console.log("Storage check:", {
          hasUser: !!storedUser,
          hasAccessToken: !!storedAccessToken,
          hasRefreshToken: !!storedRefreshToken,
        });

        if (storedUser && storedAccessToken && storedRefreshToken) {
          const user: UserLoginResponse = JSON.parse(storedUser);

          if (setAuthContextData) {
            setAuthContextData({
              currentUser: {
                ...user,
                accessToken: storedAccessToken,
                refreshToken: storedRefreshToken,
              },
            });
          }
        }
      } catch (error) {
        console.error("Failed to load auth data from AsyncStorage:", error);
        // Clear corrupted data
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.CURRENT_USER,
          STORAGE_KEYS.ACCESS_TOKEN,
          STORAGE_KEYS.REFRESH_TOKEN,
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthFromStorage();
  }, []);

  // Save to AsyncStorage helper
  const saveToAsyncStorage = useCallback(async (user: UserLoginResponse) => {
    try {
      if (user.accessToken && user.refreshToken) {
        // Store user data without tokens (tokens stored separately)
        const { accessToken, refreshToken, ...userWithoutTokens } = user;
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
          [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
          [STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutTokens)],
        ]);
      }
    } catch (error) {
      console.error("Failed to save auth data to AsyncStorage:", error);
    }
  }, []);

  // Clear AsyncStorage helper
  const clearAsyncStorage = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.CURRENT_USER,
      ]);
    } catch (error) {
      console.error("Failed to clear auth data from AsyncStorage:", error);
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      if (!setAuthContextData) {
        throw new Error("setAuthContextData is not defined");
      }

      try {
        const { data: loginData } = await loginMutation({
          variables: {
            username: credentials.employeeId,
            password: credentials.password,
          },
        });

        if (!loginData?.login) {
          throw new Error("Login failed: No data returned");
        }

        const {
          id,
          role,
          userName,
          accessToken,
          refreshToken,
          isPasswordReset,
        } = loginData.login;
        if (!role || !accessToken) {
          throw new Error("Login failed: Incomplete data");
        }

        const userData: UserLoginResponse = {
          id,
          role,
          userName,
          accessToken,
          refreshToken,
          isPasswordReset,
        };

        setAuthContextData({
          currentUser: userData,
        });

        await saveToAsyncStorage(userData);
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    [setAuthContextData, loginMutation, saveToAsyncStorage]
  );

  const logout = useCallback(async () => {
    if (!setAuthContextData) {
      throw new Error("setAuthContextData is not defined");
    }
    setAuthContextData({
      currentUser: undefined,
    });

    await clearAsyncStorage();
  }, [setAuthContextData, clearAsyncStorage]);

  const setAuthData = useCallback(
    async (user: UserLoginResponse) => {
      if (!setAuthContextData) {
        throw new Error("setAuthContextData is not defined");
      }
      setAuthContextData({
        currentUser: user,
      });

      await saveToAsyncStorage(user);
    },
    [setAuthContextData, saveToAsyncStorage]
  );

  const updateUser = useCallback(
    (user: UserLoginResponse) => {
      if (!setAuthContextData) {
        throw new Error("setAuthContextData is not defined");
      }

      setAuthContextData((prev) => ({
        ...prev,
        currentUser: user,
      }));
    },
    [setAuthContextData]
  );

  const updateAccessToken = useCallback(
    (accessToken: string) => {
      if (!setAuthContextData) {
        throw new Error("setAuthContextData is not defined");
      }

      setAuthContextData((prev) => ({
        ...prev,
        accessToken,
      }));
    },
    [setAuthContextData]
  );

  return {
    currentUser: authContextData?.currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setAuthData,
    updateUser,
    updateAccessToken,
  };
};
