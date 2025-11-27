import { Platform } from "react-native";

export enum Environment {
  DEVELOPMENT = "development",
  LOCAL = "local",
  STAGING = "staging",
  PRODUCTION = "production",
}

interface AppConfig {
  GRAPHQL_ENDPOINT: string;
  API_BASE_URL: string;
  APP_ENV: Environment;
  // IS_DEV: boolean;
}

/* -------------------------------------------
 * Default config for ALL environments
 * ----------------------------------------- */

const FALLBACK_CONFIG = {
  [Environment.LOCAL]: {
    API_BASE_URL: "http://localhost:5015",
    GRAPHQL_ENDPOINT: "http://localhost:5015/graphql",
  },
  [Environment.DEVELOPMENT]: {
    API_BASE_URL: "https://unprinted-nucleoplasmic-ammie.ngrok-free.dev/",
    GRAPHQL_ENDPOINT:
      "https://unprinted-nucleoplasmic-ammie.ngrok-free.dev/graphql/",
  },
  [Environment.STAGING]: {
    API_BASE_URL: "https://staging.myapp.com",
    GRAPHQL_ENDPOINT: "https://staging.myapp.com/graphql",
  },
  [Environment.PRODUCTION]: {
    API_BASE_URL: "https://api.myapp.com",
    GRAPHQL_ENDPOINT: "https://api.myapp.com/graphql",
  },
};

/* -------------------------------------------
 * Helpers
 * ----------------------------------------- */

const getCurrentEnvironment = (): Environment => {
  const env = process.env.EXPO_PUBLIC_APP_ENV as Environment;

  // If env file exists → use it
  if (env && Object.values(Environment).includes(env)) {
    return env;
  }

  // If .env does not exist → fallback to LOCAL
  return Environment.LOCAL;
};

// Replace localhost for Android emulator
const fixAndroidLocalhost = (url: string): string => {
  if (Platform.OS === "android" && url.includes("localhost")) {
    return url.replace("localhost", "10.0.2.2");
  }
  return url;
};

/* -------------------------------------------
 * Build Config
 * ----------------------------------------- */

const getConfig = (): AppConfig => {
  const APP_ENV = getCurrentEnvironment();
  // const IS_DEV = APP_ENV === Environment.DEVELOPMENT;

  const fallback = FALLBACK_CONFIG[APP_ENV];

  const API_BASE_URL = fixAndroidLocalhost(
    process.env.EXPO_PUBLIC_API_BASE_URL || fallback.API_BASE_URL
  );

  const GRAPHQL_ENDPOINT = fixAndroidLocalhost(
    process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT || fallback.GRAPHQL_ENDPOINT
  );

  const config: AppConfig = {
    API_BASE_URL,
    GRAPHQL_ENDPOINT,
    APP_ENV,
    // IS_DEV,
  };

  console.log("📱 App Configuration:", {
    environment: APP_ENV,
    apiBaseUrl: API_BASE_URL,
    graphqlEndpoint: GRAPHQL_ENDPOINT,
    platform: Platform.OS,
  });

  return config;
};

/* -------------------------------------------
 * Exports
 * ----------------------------------------- */

export const config = getConfig();

export const getGraphQLEndpoint = () => config.GRAPHQL_ENDPOINT;
export const getApiBaseUrl = () => config.API_BASE_URL;
export const getEnvironment = () => config.APP_ENV;
// export const isDevelopment = () => config.IS_DEV;

export default config;
