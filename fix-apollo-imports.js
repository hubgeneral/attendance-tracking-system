#!/usr/bin/env node
/**
 * Post-processing script to consolidate Apollo imports in generated graphql.ts
 * Ensures only one import: `import * as Apollo from '@apollo/client/react'`
 */

const fs = require("fs");
const path = require("path");

const graphqlFile = path.join(__dirname, "src/generated/graphql.ts");

// Read the file
let content = fs.readFileSync(graphqlFile, "utf-8");

// Remove all Apollo-related imports (we'll replace them with one consolidated import)
content = content
  .replace(/import \* as Apollo from ['"]@apollo\/client['"]\s*;\n?/g, "")
  .replace(
    /import \* as ApolloReactCommon from ['"]@apollo\/client\/react['"]\s*;\n?/g,
    ""
  )
  .replace(
    /import \* as ApolloReactHooks from ['"]@apollo\/client\/react['"]\s*;\n?/g,
    ""
  )
  .replace(/import type \* as Apollo from ['"]@apollo\/client['"]\s*;\n?/g, "");

// Find the gql import line
const gqlImportMatch = content.match(
  /import.*from ['"]@apollo\/client['"]\s*;/
);

if (gqlImportMatch) {
  // Insert the consolidated Apollo import right after the gql import
  content = content.replace(
    gqlImportMatch[0],
    gqlImportMatch[0] + "\nimport * as Apollo from '@apollo/client/react';"
  );
} else {
  // If no gql import found, add both at the top after any existing imports
  content =
    "import { gql } from '@apollo/client';\nimport * as Apollo from '@apollo/client/react';\n" +
    content;
}

// Replace all ApolloReactHooks references with Apollo
content = content.replace(/ApolloReactHooks\./g, "Apollo.");

// Replace all ApolloReactCommon references with Apollo
content = content.replace(/ApolloReactCommon\./g, "Apollo.");

// Write back
fs.writeFileSync(graphqlFile, content, "utf-8");

console.log("✅ Apollo imports consolidated successfully");
