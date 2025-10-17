import type { CodegenConfig } from "@graphql-codegen/cli";
import { config } from "dotenv";

// Load environment variables from .env file
config();

const codegenConfig: CodegenConfig = {
  overwrite: true,
  schema:
    process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT ||
    "http://localhost:5015/graphql/",
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
      },
    },
  },
};

export default codegenConfig;
