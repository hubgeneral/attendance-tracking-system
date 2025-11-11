import {
  useLoginMutation,
  type UserLoginResponse,
} from "@/src/generated/graphql";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/auth-context/AuthContext";

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
  updateUserAndPersist: (user: UserLoginResponse) => Promise<void>;
  updateAccessToken: (accessToken: string) => void;
  refreshCurrentUser: () => Promise<void>;
}

// AsyncStorage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  CURRENT_USER: "currentUser",
  RESET_TOKEN: "resetToken",
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

        const storedResetToken = await AsyncStorage.getItem(
          STORAGE_KEYS.RESET_TOKEN
        );

        console.log("Storage check:", {
          hasUser: !!storedUser,
          hasAccessToken: !!storedAccessToken,
          hasRefreshToken: !!storedRefreshToken,
          hasResetToken: !!storedResetToken,
        });

        if (
          storedUser &&
          storedAccessToken &&
          storedRefreshToken &&
          storedResetToken
        ) {
          const user: UserLoginResponse = JSON.parse(storedUser);

          if (setAuthContextData) {
            setAuthContextData({
              currentUser: {
                ...user,
                accessToken: storedAccessToken,
                refreshToken: storedRefreshToken,
                resetToken: storedResetToken,
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
          STORAGE_KEYS.RESET_TOKEN,
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthFromStorage();
  }, [setAuthContextData]);

  // Save to AsyncStorage helper
  const saveToAsyncStorage = useCallback(async (user: UserLoginResponse) => {
    try {
      if (user.accessToken && user.refreshToken) {
        // Store user data without tokens (tokens stored separately)
        const { accessToken, refreshToken, resetToken, ...userWithoutTokens } =
          user;
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
          [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
          [STORAGE_KEYS.RESET_TOKEN, resetToken || ""],
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

  // const login = useCallback(
  //   async (credentials: LoginCredentials) => {
  //     if (!setAuthContextData) {
  //       throw new Error("setAuthContextData is not defined");
  //     }

  //     try {
  //       const { data: loginData } = await loginMutation({
  //         variables: {
  //           username: credentials.employeeId,
  //           password: credentials.password,
  //         },
  //       });

  //       if (!loginData?.login) {
  //         throw new Error("Login failed: No data returned");
  //       }

  //       const {
  //         id,
  //         role,
  //         userName,
  //         accessToken,
  //         refreshToken,
  //         isPasswordReset,
  //       } = loginData.login;
  //       if (!role || !accessToken) {
  //         throw new Error("Login failed: Incomplete data");
  //       }

  //       const userData: UserLoginResponse = {
  //         id,
  //         role,
  //         userName,
  //         accessToken,
  //         refreshToken,
  //         isPasswordReset,
  //       };

  //       setAuthContextData({
  //         currentUser: userData,
  //       });

  //       await saveToAsyncStorage(userData);
  //     } catch (error) {
  //       console.error("Login error:", error);
  //       throw error;
  //     }
  //   },
  //   [setAuthContextData, loginMutation, saveToAsyncStorage]
  // );

  // In your useAuth hook, update the login function:
  // const login = useCallback(
  //   async (credentials: LoginCredentials) => {
  //     if (!setAuthContextData) {
  //       throw new Error("setAuthContextData is not defined");
  //     }

  //     try {
  //       const { data: loginData } = await loginMutation({
  //         variables: {
  //           username: credentials.employeeId,
  //           password: credentials.password,
  //         },
  //       });

  //       if (!loginData?.login) {
  //         throw new Error("Login failed: No data returned");
  //       }

  //       const {
  //         id,
  //         role,
  //         userName,
  //         accessToken,
  //         refreshToken,
  //         isPasswordReset,
  //       } = loginData.login;

  //       if (!role || !accessToken) {
  //         throw new Error("Login failed: Incomplete data");
  //       }

  //       const userData: UserLoginResponse = {
  //         id,
  //         role,
  //         userName,
  //         accessToken,
  //         refreshToken,
  //         isPasswordReset,
  //       };

  //       setAuthContextData({
  //         currentUser: userData,
  //       });

  //       await saveToAsyncStorage(userData);

  //       if (id !== null && id !== undefined) {
  //         await AsyncStorage.setItem("USER_ID", id.toString());
  //         console.log("✅ User ID stored for geofence:", id);
  //       } else {
  //         console.warn("User ID is null or undefined; not storing to AsyncStorage.");
  //       }

  //     } catch (error) {
  //       console.error("Login error:", error);
  //       throw error;
  //     }
  //   },
  //   [setAuthContextData, loginMutation, saveToAsyncStorage]
  // );

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
          resetToken,
          isPasswordReset,
        } = loginData.login;

        if (!role || !accessToken) {
          throw new Error("Login failed: Incomplete data");
        }

        if (!id) {
          throw new Error("Login failed: No user ID returned");
        }

        const userData: UserLoginResponse = {
          id,
          role,
          userName,
          accessToken,
          refreshToken,
          resetToken,
          isPasswordReset,
        };

        setAuthContextData({
          currentUser: userData,
        });

        await saveToAsyncStorage(userData);

        // STORE THE CORRECT ID FOR GEOFENCE
        await AsyncStorage.setItem("USER_ID", id.toString());
        console.log(" User ID stored for geofence:", id);
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

  const updateUserAndPersist = useCallback(
    async (user: UserLoginResponse) => {
      if (!setAuthContextData) {
        throw new Error("setAuthContextData is not defined");
      }

      // Update context
      setAuthContextData((prev) => ({
        ...prev,
        currentUser: user,
      }));

      // Persist to AsyncStorage
      await saveToAsyncStorage(user);
    },
    [setAuthContextData, saveToAsyncStorage]
  );

  const refreshCurrentUser = useCallback(async () => {
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
      const storedResetToken = await AsyncStorage.getItem(
        STORAGE_KEYS.RESET_TOKEN
      );

      if (storedUser && storedAccessToken && storedRefreshToken) {
        try {
          const user: UserLoginResponse = JSON.parse(storedUser);
          if (setAuthContextData) {
            setAuthContextData({
              currentUser: {
                ...user,
                accessToken: storedAccessToken,
                refreshToken: storedRefreshToken,
                resetToken: storedResetToken,
              },
            });
          }
        } catch {
          console.warn("Stored `currentUser` is not valid JSON:", storedUser);
        }
      }
    } catch (error) {
      console.error("Failed to refresh user from storage:", error);
    }
  }, [setAuthContextData]);

  return {
    currentUser: authContextData?.currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setAuthData,
    updateUser,
    updateUserAndPersist,
    refreshCurrentUser,
    updateAccessToken,
  };
};
