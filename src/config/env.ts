import { Platform } from "react-native";

// Environment types
export enum Environment {
  DEVELOPMENT = "development",
  LOCAL = "local"
}

// Configuration interface
interface AppConfig {
  GRAPHQL_ENDPOINT: string;
  API_BASE_URL: string;
  APP_ENV: Environment;
  IS_DEV: boolean;
}

// Get current environment from process.env or default to development
const getCurrentEnvironment = (): Environment => {
  const env = process.env.EXPO_PUBLIC_APP_ENV as Environment;
  return env && Object.values(Environment).includes(env)
    ? env
    : Environment.DEVELOPMENT;
};

// Environment-specific configurations
const getConfig = (): AppConfig => {
  const currentEnv = getCurrentEnvironment();

  // Base configurations
  const baseConfig = {
    API_BASE_URL:
      process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:5015",
    APP_ENV: currentEnv,
    IS_DEV: currentEnv === Environment.DEVELOPMENT,
  };

  // Platform-specific GraphQL endpoint handling
  let graphqlEndpoint =
    process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT ||
    `${baseConfig.API_BASE_URL}/graphql/`;

  // Handle Android emulator localhost mapping
  if (
    currentEnv === Environment.DEVELOPMENT &&
    graphqlEndpoint.includes("localhost") &&
    Platform.OS === "android"
  ) {
    graphqlEndpoint = graphqlEndpoint.replace("localhost", "192.168.31.194");
  }

  return {
    ...baseConfig,
    GRAPHQL_ENDPOINT: graphqlEndpoint,
  };
};

// Get the current configuration
export const config = getConfig();

// Helper functions
export const getGraphQLEndpoint = (): string => config.GRAPHQL_ENDPOINT;
export const getApiBaseUrl = (): string => config.API_BASE_URL;
export const getEnvironment = (): Environment => config.APP_ENV;
export const isDevelopment = (): boolean => config.IS_DEV;

export default config;
