# Critical Mind

## Overview

Critical Mind is an educational mobile application built with Expo/React Native that guides users through controversial topics via progressive information layers. Users explore topics from surface-level understanding to deep analysis through a card-based swipe interface, earning points for engagement and tracking their learning progress.

The app follows a dark-themed design with a deep space blue aesthetic, featuring a tab-based navigation system with Home (card exploration), Explore (topic discovery), Library (favorites), and Insights (stats/achievements) screens.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Expo SDK 54 with React Native 0.81, using the new React Native architecture and React 19.

**Navigation**: React Navigation v7 with bottom tab navigator (`@react-navigation/bottom-tabs`) and native stack navigator for screen transitions.

**State Management**:
- TanStack React Query for server state and API caching
- React Context (`UserDataContext`) for global user data (points, likes, favorites)
- AsyncStorage for local persistence of user progress

**Animation**: React Native Reanimated v4 with gesture handling via `react-native-gesture-handler` for smooth card swipe interactions.

**Styling**: StyleSheet-based styling with a centralized theme system in `client/constants/theme.ts`. Uses `expo-linear-gradient` for gradient backgrounds and `expo-blur` for glass effects.

**Path Aliases**:
- `@/` maps to `./client/`
- `@shared/` maps to `./shared/`

### Backend Architecture

**Server**: Express.js running on Node.js with TypeScript (compiled via tsx in dev, esbuild for production).

**API Pattern**: RESTful endpoints under `/api/` prefix with JSON request/response bodies.

**Authentication**: Password hashing with bcrypt (10 salt rounds). User sessions managed through the storage layer.

**Database Access**: Storage pattern (`server/storage.ts`) abstracts database operations, implementing `IStorage` interface for all data access.

### Data Storage

**Database**: PostgreSQL with Drizzle ORM for type-safe queries and migrations.

**Schema** (in `shared/schema.ts`):
- `users`: User accounts with username, hashed password, points
- `user_topic_progress`: Tracks per-topic progress (current section, completion, likes, favorites)
- `user_engagement`: Analytics data (view counts, time spent per topic)

**Validation**: Drizzle-Zod integration for schema-to-Zod type generation.

### Client-Side Data

**Local Storage**: AsyncStorage persists user points, liked topics, favorited topics, and completed topics for offline access and quick loading.

**Topics Data**: Static topic content stored in `client/data/topics.ts` with sections for progressive disclosure.

## External Dependencies

### Database
- **PostgreSQL**: Primary database, configured via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database toolkit with `drizzle-kit` for migrations

### Mobile/Web Platform
- **Expo**: Build and development platform (SDK 54)
- **React Native Web**: Web target support

### APIs and Services
- No external third-party APIs currently integrated
- Server exposes REST endpoints for user management and progress tracking

### Key Libraries
- **bcrypt**: Password hashing for user authentication
- **TanStack React Query**: Server state management and caching
- **React Navigation**: Navigation framework
- **React Native Reanimated**: Animation engine
- **expo-haptics**: Haptic feedback for interactions