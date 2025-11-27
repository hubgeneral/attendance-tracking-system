const { config: loadEnv } = require("dotenv");

loadEnv();

// Manual list of environment fallbacks (kept small and JS-friendly so this
// file can run in plain Node without TS tooling).
const FALLBACK_GRAPHQL = {
  local: "http://localhost:5015/graphql",
  development: "https://unprinted-nucleoplasmic-ammie.ngrok-free.dev/graphql/",
  staging: "https://staging.myapp.com/graphql",
  production: "https://api.myapp.com/graphql",
};

const getEnvironment = () => {
  const env = process.env.EXPO_PUBLIC_APP_ENV;
  if (env && ["development", "local", "staging", "production"].includes(env)) {
    return env;
  }
  return "local";
};

const resolveGraphQLEndpoint = () => {
  if (process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT) {
    return process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT;
  }

  const env = getEnvironment();
  return FALLBACK_GRAPHQL[env] || FALLBACK_GRAPHQL.local;
};

const GRAPHQL_SCHEMA_URL = resolveGraphQLEndpoint();

/** @type {import('@graphql-codegen/cli').CodegenConfig} */
const codegenConfig = {
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

console.log("🛠️ GraphQL Codegen cjs using Schema:", GRAPHQL_SCHEMA_URL);

module.exports = codegenConfig;
