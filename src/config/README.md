# Environment Configuration

This directory contains environment configuration for the Attendance Tracking System.

## Usage

### Basic Usage

```typescript
import {
  config,
  getGraphQLEndpoint,
  getApiBaseUrl,
  isDevelopment,
} from "../config/env";

// Access configuration directly
console.log("GraphQL Endpoint:", config.GRAPHQL_ENDPOINT);
console.log("API Base URL:", config.API_BASE_URL);
console.log("Is Development:", config.IS_DEV);

// Or use helper functions
const endpoint = getGraphQLEndpoint();
const baseUrl = getApiBaseUrl();
const isDev = isDevelopment();
```

### Environment Variables

The app supports the following environment variables in your `.env` file:

- `EXPO_PUBLIC_APP_ENV`: Environment name (development, staging, production)
- `EXPO_PUBLIC_API_BASE_URL`: Base URL for your API server
- `EXPO_PUBLIC_GRAPHQL_ENDPOINT`: Full GraphQL endpoint URL

### Platform Support

The configuration automatically handles platform-specific differences:

- **Android Emulator**: Automatically maps `localhost` to `10.0.2.2` for GraphQL connections
- **iOS Simulator**: Uses `localhost` directly
- **Web**: Uses the configured URLs as-is

### Environment-Specific Configurations

```typescript
// Example: Different configurations for different environments
switch (getEnvironment()) {
  case Environment.DEVELOPMENT:
    // Development-specific logic
    break;
  case Environment.STAGING:
    // Staging-specific logic
    break;
  case Environment.PRODUCTION:
    // Production-specific logic
    break;
}
```

### Apollo Client Integration

The Apollo client is automatically configured to use the environment settings:

```typescript
import { client } from "../lib/apolloClient";
// client is already configured with the correct GraphQL endpoint
```
