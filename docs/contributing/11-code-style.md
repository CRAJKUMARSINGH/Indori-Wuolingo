# 11 · Code Style

Conventions for TypeScript, React Native, and Expo used across this codebase.

These are not arbitrary preferences — they exist to keep the codebase consistent, readable, and easy to navigate for a small async team.

---

## TypeScript

### Strict mode

The project uses strict TypeScript. `tsconfig.base.json` enables `strict: true`. This includes:
- `strictNullChecks` — no implicit null/undefined
- `noImplicitAny` — all variables must be typed
- `strictFunctionTypes` — function parameter types are checked covariantly

Every file must typecheck. Run `pnpm run typecheck` before pushing.

### Type vs Interface

Use `interface` for object shapes. Use `type` for unions and aliases.

```typescript
// Good
interface UserProfile {
  displayName: string;
  targetLanguage: string;
}

type Exercise = MultipleChoiceExercise | WordOrderExercise;

// Avoid
type UserProfile = {
  displayName: string;
};
```

### Never suppress type errors silently

```typescript
// Bad
const x = foo as any;

// Acceptable — with a comment explaining why
const route = router.push('/lesson/[id]' as any); // expo-router typed routes limitation

// Good — fix the root type issue instead
```

Use `as any` only as a last resort, and always leave a comment.

### Null handling

```typescript
// Bad
const name = user.profile.name;

// Good
const name = user?.profile?.name ?? 'Learner';
```

---

## React Native components

### One component per file

Each screen and reusable component should be in its own file. Do not put multiple exported components in one file unless they are tightly coupled (e.g. a parent and its sub-components in `ExerciseView.tsx`).

### StyleSheet at the bottom

Define styles at the bottom of the file using `StyleSheet.create()`. Never inline complex style objects.

```typescript
// Good
<View style={styles.container}>

// Bad for anything beyond 1–2 properties
<View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 }}>
```

### Colors from `useColors()` hook — always

```typescript
// Good
const colors = useColors();
<Text style={{ color: colors.foreground }}>Hello</Text>

// Bad — hardcoded colors break dark mode and rebranding
<Text style={{ color: '#1A1829' }}>Hello</Text>
```

### Fonts from Inter family — always

```typescript
// Good
fontFamily: 'Inter_700Bold'
fontFamily: 'Inter_600SemiBold'
fontFamily: 'Inter_500Medium'
fontFamily: 'Inter_400Regular'

// Bad
fontWeight: 'bold'
```

### Platform guards for native APIs

```typescript
// Good
if (Platform.OS !== 'web') {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

// Bad — Haptics will throw on web
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```

---

## Navigation

Use `router.push` for forward navigation and `router.replace` for screens that should not be in the back stack (lesson complete → home, onboarding → tabs).

```typescript
// Forward (user can go back)
router.push(`/lesson/${lessonId}` as any);

// Replace (no back button)
router.replace('/(tabs)' as any);
```

For dynamic routes, `as any` is acceptable because expo-router typed routes do not support all dynamic patterns yet.

---

## State and context

- All global state lives in `AppContext.tsx`. Do not create a second context provider.
- Local UI state (animations, selected option, pressed state) lives in `useState` inside the component.
- AsyncStorage writes happen only inside `AppContext.tsx` — never read or write AsyncStorage directly from a screen.

```typescript
// Good — use context
const { completeLesson } = useAppContext();
await completeLesson(lessonId, xpReward, wrongWordIds);

// Bad — bypass context
await AsyncStorage.setItem('iw_user_progress', JSON.stringify(next));
```

---

## Async / error handling

Always handle async errors explicitly. Do not use empty catch blocks.

```typescript
// Bad
try {
  await doSomething();
} catch {}

// Good
try {
  await doSomething();
} catch (error) {
  console.error('Failed to do something:', error);
  // show user feedback or graceful fallback
}
```

---

## Logging

- Never use `console.log` in production code
- Use `console.error` only for genuine error conditions during development
- Remove all debug logging before opening a PR

---

## File naming

| Thing | Convention | Example |
|---|---|---|
| Screens | `kebab-case.tsx` | `language.tsx`, `[lessonId].tsx` |
| Components | `PascalCase.tsx` | `ExerciseView.tsx`, `ErrorBoundary.tsx` |
| Contexts | `PascalCase.tsx` | `AppContext.tsx` |
| Hooks | `camelCase.ts` (prefixed `use`) | `useColors.ts` |
| Data files | `camelCase.ts` | `curriculum.ts` |
| Constants | `camelCase.ts` | `colors.ts` |

---

## Imports

Group imports in this order, separated by a blank line:

```typescript
// 1. React and React Native
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Expo and third-party packages
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// 3. Workspace packages
import { useColors } from '@/hooks/useColors';
import { useAppContext } from '@/contexts/AppContext';
import type { Exercise } from '@/data/curriculum';
```

Use `@/` path aliases (configured in `tsconfig.json`) — never use relative paths like `../../hooks/useColors`.
