import { Platform } from "react-native";

// Environment types
export enum Environment {
  DEVELOPMENT = "development",
  LOCAL = "local",
  STAGING = "staging",
  PRODUCTION = "production",
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
    : Environment.LOCAL; // Default to LOCAL instead of DEVELOPMENT
};

// Environment-specific configurations
const getConfig = (): AppConfig => {
  const currentEnv = getCurrentEnvironment();

  // Base configurations - pick from env or default to localhost
  const initialApiBase =
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    "https://unprinted-nucleoplasmic-ammie.ngrok-free.dev/";

  // If running on Android emulator, requests to 'localhost' should go to 10.0.2.2
  // (Android emulator maps host machine localhost to 10.0.2.2)
  const resolvedApiBase =
    Platform.OS === "android" && initialApiBase.includes("localhost")
      ? initialApiBase.replace("localhost", "10.0.2.2")
      : initialApiBase;

  const baseConfig = {
    API_BASE_URL: resolvedApiBase,
    APP_ENV: currentEnv,
    IS_DEV: currentEnv === Environment.DEVELOPMENT,
  };

  // Platform-specific GraphQL endpoint handling
  let graphqlEndpoint =
    process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT || `${baseConfig.API_BASE_URL}/graphql/`;

  // Also rewrite graphqlEndpoint if it contains localhost and we're on Android
  if (Platform.OS === "android" && graphqlEndpoint.includes("localhost")) {
    graphqlEndpoint = graphqlEndpoint.replace("localhost", "10.0.2.2");
  }

  return {
    ...baseConfig,
    GRAPHQL_ENDPOINT: graphqlEndpoint,
  };
};

console.log("api base url", getConfig().API_BASE_URL);
console.log("graphql endpoint", getConfig().GRAPHQL_ENDPOINT);
console.log("environment", getConfig().APP_ENV);

// Get the current configuration
export const config = getConfig();

// Helper functions
export const getGraphQLEndpoint = (): string => config.GRAPHQL_ENDPOINT;
export const getApiBaseUrl = (): string => config.API_BASE_URL;
export const getEnvironment = (): Environment => config.APP_ENV;
export const isDevelopment = (): boolean => config.IS_DEV;

// Log current configuration (only in development)
if (config.IS_DEV) {
  console.log("📱 App Configuration:", {
    environment: config.APP_ENV,
    graphqlEndpoint: config.GRAPHQL_ENDPOINT,
    apiBaseUrl: config.API_BASE_URL,
    platform: Platform.OS,
  });
}

export default config;
