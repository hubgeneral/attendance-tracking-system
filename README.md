# Attendance Tracking System

A React Native application for managing employee attendance using Expo, Apollo Client, and GraphQL.

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- Android emulator or physical Android device (for Android development)
- iOS simulator or physical iOS device (for iOS development) - macOS only

## Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies:

   ```bash
   npm install
   ```

## Environment Setup

### Local Development (.env not required)

If running against a local backend (localhost):

- The app uses `http://localhost:5015/graphql` as the default GraphQL endpoint
- No `.env` file is needed

### Staging/Production (.env required)

For staging or production environments, create a `.env` file in the project root:

```env
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_GRAPHQL_ENDPOINT=https://your-graphql-endpoint.com/graphql
```

**Environment options:**

- `local` - Local development (default)
- `development` - Development server
- `staging` - Staging environment
- `production` - Production environment

## Development

### Web Development

Start the web version:

```bash
npm run web
```

The app will open in your default browser at `http://localhost:19006`

### Android Development

Start the Android version:

```bash
npm run android
```

This will:

- Build the APK
- Start the development server
- Launch the app on an Android emulator or connected device

**Requirements:**

- Android Studio installed with emulator, OR
- Physical Android device with USB debugging enabled

### iOS Development

Start the iOS version:

```bash
npm run ios
```

**Note:** Requires macOS and Xcode installed

### Start Development Server

To start the general development server (choose platform interactively):

```bash
npm start
```

Options will appear to open in:

- Development build
- Android emulator
- iOS simulator
- Expo Go

## Project Structure

```
├── app/                  # File-based routing (Expo Router)
│   ├── (auth)/          # Authentication screens
│   ├── (tabs)/          # Tab-based navigation
│   └── index.tsx        # Root entry point
├── components/          # Reusable React components
├── contexts/            # React context for state management
├── hooks/               # Custom React hooks
├── src/
│   ├── config/          # Configuration files
│   ├── generated/       # GraphQL codegen output (auto-generated)
│   ├── graphql/         # GraphQL queries and mutations
│   └── lib/             # Utility libraries (Apollo Client)
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── assets/              # Images and static assets
```

## GraphQL Codegen

Generate TypeScript types from GraphQL schema and operations:

```bash
npm run codegen
```

This will:

1. Generate types in `src/generated/graphql.ts`
2. Consolidate Apollo imports automatically
3. Create typed hooks for queries and mutations

**Note:** The codegen automatically consolidates Apollo imports to prevent duplicates.

## Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Key Technologies

- **Expo** - React Native framework
- **React Navigation** - Navigation library
- **Apollo Client** - GraphQL client
- **GraphQL Codegen** - Type generation from GraphQL
- **AsyncStorage** - Local storage solution
- **TypeScript** - Type safety
- **React Router** - File-based routing

## API Integration

The app connects to a GraphQL API for:

- User authentication (login, password reset)
- Attendance tracking (clock in/out)
- Geofencing for location-based clocking
- Employee data and roles
- Leave management

**Default endpoints by environment:**

- Local: `http://localhost:5015/graphql`
- Development: `https://unprinted-nucleoplasmic-ammie.ngrok-free.dev/graphql/`
- Staging: `https://staging.myapp.com/graphql`
- Production: `https://api.myapp.com/graphql`

## Available Scripts

| Script                  | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `npm start`             | Start dev server (interactive platform selection) |
| `npm run web`           | Start web development server                      |
| `npm run android`       | Build and run on Android emulator/device          |
| `npm run ios`           | Build and run on iOS simulator/device             |
| `npm run lint`          | Run ESLint                                        |
| `npm run codegen`       | Generate TypeScript types from GraphQL            |
| `npm run reset-project` | Reset app directory to starter code               |

## Troubleshooting

### Codegen fails

If GraphQL codegen fails, ensure:

- The GraphQL endpoint is accessible
- `.env` is correctly configured for non-local environments
- All GraphQL documents in `src/graphql/` are valid

### Apollo imports not consolidated

The post-processing script (`fix-apollo-imports.js`) runs automatically after codegen. If imports are still duplicated, run:

```bash
node fix-apollo-imports.js
```

### AsyncStorage errors

If you encounter AsyncStorage parsing errors, ensure data is serialized properly before storing. The app validates JSON data on retrieval.

## Contributing

1. Create feature branches from `clocking_history`
2. Run linting before committing: `npm run lint`
3. Regenerate types if GraphQL schema changes: `npm run codegen`
4. Keep ESLint clean (fix errors, not just warnings)

## Support

For issues or questions, refer to:

- [Expo Documentation](https://docs.expo.dev/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [GraphQL Documentation](https://graphql.org/learn/)
