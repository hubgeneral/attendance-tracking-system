import type { CodegenConfig } from "@graphql-codegen/cli";
import { config as loadEnv } from "dotenv";
import { Environment } from "./src/config/env";

loadEnv();

// ---------------------------
// GraphQL fallback URLs per environment
// ---------------------------
const FALLBACK_GRAPHQL = {
  [Environment.LOCAL]: "http://localhost:5015/graphql",
  [Environment.DEVELOPMENT]:
    "https://unprinted-nucleoplasmic-ammie.ngrok-free.dev/graphql/",
  [Environment.STAGING]: "https://staging.myapp.com/graphql",
  [Environment.PRODUCTION]: "https://api.myapp.com/graphql",
};

// ---------------------------
// Determine active environment
// ---------------------------
const getEnvironment = (): Environment => {
  const env = process.env.EXPO_PUBLIC_APP_ENV as Environment;

  if (env && Object.values(Environment).includes(env)) {
    return env;
  }

  // If env variable is missing → fallback to LOCAL
  return Environment.LOCAL;
};

// ---------------------------
// Resolve GraphQL Endpoint
// ---------------------------
const resolveGraphQLEndpoint = () => {
  // 1. Explicit .env variable takes highest priority
  if (process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT) {
    return process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT;
  }

  // 2. If EXPO_PUBLIC_APP_ENV exists → use fallback for that environment
  const env = getEnvironment();
  return FALLBACK_GRAPHQL[env] || FALLBACK_GRAPHQL.local;
};

// Final computed endpoint for codegen
const GRAPHQL_SCHEMA_URL = resolveGraphQLEndpoint();

// ---------------------------
// Codegen Configuration
// ---------------------------
const codegenConfig: CodegenConfig = {
  overwrite: true,
  schema: GRAPHQL_SCHEMA_URL,
  documents: "src/**/*.{graphql,gql}",
  generates: {
    "src/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        skipTypename: false,
        withHooks: true,
        withHOC: false,
        withComponent: false,

        reactApolloVersion: 3,
        useGroupedApolloImport: true,
        apolloImportNamespace: "Apollo",
        apolloReactHooksImportFrom: "@apollo/client/react",
      },
    },
  },
};

console.log("🛠️ GraphQL Codegen ts using Schema:", GRAPHQL_SCHEMA_URL);

export default codegenConfig;
