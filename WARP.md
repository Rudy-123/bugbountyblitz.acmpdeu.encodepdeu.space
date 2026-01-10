# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Evolution CTF** is a Capture The Flag (CTF) web application built with Next.js 15, featuring time-themed security challenges across three eras: Past, Present, and Future. The app tracks player progress, timestamps, and scoring using client-side localStorage with React Context for state management.

## Development Commands

### Starting the Development Server
```bash
npm run dev
# Starts Next.js dev server with Turbopack on port 9002
```

### Genkit AI Development
```bash
npm run genkit:dev
# Starts Genkit development server with tsx
npm run genkit:watch
# Starts Genkit with watch mode for hot reload
```

### Building and Production
```bash
npm run build
# Production build (sets NODE_ENV=production)
npm start
# Start production server
```

### Code Quality
```bash
npm run lint
# Run ESLint
npm run typecheck
# Run TypeScript type checking without emitting files
```

## Architecture Overview

### Application Structure

**Core Patterns:**
- **App Router**: Uses Next.js 15 App Router with file-based routing in `src/app/`
- **Server Actions**: Flag validation and SSRF simulation in `src/lib/actions.ts`
- **Client State**: React Context Provider (`src/app/providers.tsx`) manages game state via localStorage
- **Type Safety**: TypeScript with strict mode, centralized types in `src/lib/types.ts`

**Key Routes:**
- `/` - Landing page with game start
- `/challenges` - Challenge listing by era
- `/challenges/[id]` - Individual challenge detail pages with simulations
- `/admin` - Password-protected admin panel (password: `evolution_admin_password`)
- `/scoreboard` - Player rankings by score/time
- `/answers` - Answer key page
- `/not-a-real-robots-txt` - Simulated robots.txt challenge

### State Management Architecture

The app uses a **Context + localStorage hybrid** pattern:
- `PlayerContext` in `src/app/providers.tsx` wraps the entire app
- Stores: 
  - `startTime` (game timer)
  - `solvedChallenges` (array of {id, timestamp})
  - `hintsUsed` (array of {challengeId, hintIndex, cost})
- Persists to localStorage: `ctf_startTime`, `ctf_solvedChallenges`, `ctf_hintsUsed`
- Custom hook `usePlayer()` provides: 
  - `startGame()`, `addSolvedChallenge()`, `isChallengeSolved()`, `getSolveTimestamp()`
  - `useHint()`, `isHintUsed()`, `getTotalPenalty()` (for hint penalty system)

### Challenge System

**Challenge Data Flow:**
1. **Client metadata**: `src/lib/challenges.ts` exports challenge data WITHOUT flags (safe for client)
2. **Server data**: `src/lib/challenges-server.ts` exports complete challenge data WITH flags (server-only)
3. Types defined in `src/lib/types.ts` (Challenge, ChallengeEra)
4. Server action `submitFlag()` validates submissions using server-side data (case-sensitive)
5. On success: triggers toast notification → updates context → persists to localStorage
6. Challenge "solved" state merged at runtime in components

**Security Architecture:**
- Flags are NEVER exposed to client-side code
- `challenges-server.ts` uses `'server-only'` import to enforce server-side usage
- Client components use flag-less metadata from `challenges.ts`
- Admin and answers pages use server components to access flags securely

**Simulation Types:**
- `sqli` - SQL injection demo (shows simulated database records, not raw flag)
- `xss` - Cross-site scripting demo  
- `ssrf` - Server-side request forgery (uses `fetchUrl()` server action)
- `robots` - Robots.txt exploration
- `dns` - DNS TXT record lookup (via admin panel)

### UI Component Architecture

**Component Library:** shadcn/ui with Radix UI primitives
- All UI components in `src/components/ui/`
- CTF-specific components in `src/components/ctf/`
- Global layout components in `src/components/layout/`

**Design System:**
- **Fonts**: 'Space Grotesk' (headlines), 'Inter' (body), defined in `tailwind.config.ts`
- **Colors**: HSL CSS variables via Tailwind theme
  - Primary: Deep desaturated teal (#468499)
  - Accent: Complementary orange (#E07A5F)
  - Background: Off-white (#F0F8FF)
- **Icons**: Lucide React library
- **Animations**: Custom `fade-in` keyframe animation

### AI Integration (Genkit)

**Configuration:**
- Genkit setup in `src/ai/genkit.ts`
- Uses Google AI plugin with `gemini-2.5-flash` model
- Dev entry point: `src/ai/dev.ts`
- Integrated with Next.js via `@genkit-ai/next`

**Usage Pattern:**
```typescript
import { ai } from '@/ai/genkit';
// ai instance available for flows/prompts
```

### Import Aliases

TypeScript path aliases configured in `tsconfig.json`:
- `@/components` → `src/components/`
- `@/lib` → `src/lib/`
- `@/hooks` → `src/hooks/`
- `@/app` → `src/app/`

### Firebase Integration

- Configured for Firebase App Hosting (see `apphosting.yaml`)
- Max instances: 1 (development setting)
- Firebase SDK imported in project dependencies

## Important Implementation Details

### Flag Submission Flow
1. User submits flag via `FlagForm` component
2. Uses React `useFormState` with server action pattern
3. Server action in `src/lib/actions.ts` validates flag (case-sensitive string match)
4. Success triggers: toast notification → context update → localStorage persistence
5. Challenge card UI updates reactively via `isChallengeSolved()` hook

### Admin Panel Access
- Route: `/admin`
- Password: Configured via `NEXT_PUBLIC_ADMIN_PASSWORD` environment variable
  - Default: `evolution_admin_password` (for development)
  - **IMPORTANT**: Change this in production!
- Session-based auth via sessionStorage
- Provides: challenge/flag reference table, DNS TXT lookup tool

### Answers Page Access
- Route: `/answers`
- Protected with same admin password as admin panel
- Server component with client-side authentication wrapper (`AnswersAuth`)
- Displays all challenge flags for instructors/admins

### SSRF Challenge Implementation
- Component: `SsrfClient.tsx`
- Server action: `fetchUrl()` in `src/lib/actions.ts`
- Whitelist: Only allows `picsum.photos` OR `localhost:3001/secret`
- Secret endpoint returns flag `FLAG{INTERNAL_SSRF}`

### Client-Side Security Simulations
Challenges simulate vulnerabilities for educational purposes:
- XSS challenge stores script in `extraData.comment` field
- SQL injection shown through URL manipulation demonstration
- Robots.txt served from non-standard route `/not-a-real-robots-txt/page.tsx`

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- Build errors and lint errors ignored during builds (set in `next.config.ts`)
- Path aliases via `@/*` pattern

### Image Optimization
Next.js image optimization configured for:
- `placehold.co`
- `images.unsplash.com`
- `picsum.photos`

## Testing Strategy

**Note:** No test files currently exist in the codebase. When adding tests:
- Use Jest or Vitest for unit tests
- Test server actions independently from components
- Mock localStorage for context provider tests
- Test challenge validation logic in `src/lib/actions.ts`
- Consider E2E tests for complete challenge solve flows

## Common Patterns

### Adding a New Challenge
1. Add challenge object to BOTH `src/lib/challenges.ts` (without flag) AND `src/lib/challenges-server.ts` (with flag)
2. Define flag as `FLAG{SOMETHING}` format
3. Set `simulation` type if interactive component needed
4. Implement simulation component in `src/components/ctf/` if required
5. Update challenge detail page route if custom behavior needed
6. **CRITICAL**: Never reference the flag directly in client components or simulations

### Creating New UI Components
```bash
# shadcn/ui components can be added via CLI (if available)
# Manual: Create in src/components/ui/ following Radix UI + Tailwind pattern
```

### Server Actions Pattern
All server actions:
- Marked with `"use server"` directive
- Located in `src/lib/actions.ts`
- Return consistent response shapes with `success` and `message` fields
- Handle validation and business logic server-side

### Client Component Pattern
Components using hooks or browser APIs:
- Must include `"use client"` directive
- Use `usePlayer()` hook for game state
- Use `useToast()` for notifications
- Follow React Server Components best practices

## CTF Security Best Practices

### Flag Protection
1. **Never expose flags in client-side code**
   - Use `challenges.ts` (without flags) for client components
   - Use `challenges-server.ts` (with flags) only in server actions and server components
   - The `'server-only'` import enforces this at build time

2. **Challenge Simulations**
   - When showing "success" states in simulations (e.g., SQL injection), display the flag as part of realistic output
   - Example: Show simulated database records where one contains the flag
   - Never just display `challenge.flag` directly

3. **Admin Access**
   - Always use environment variables for passwords
   - Change default passwords in production
   - Both `/admin` and `/answers` pages are protected

### Hint System
- Hints must have associated cost values
- Cost of 0 = free hint (typically first hint)
- Costs are deducted from final score automatically
- Hint usage persists in localStorage

### Single-Player Design
- This is a **single-player CTF** using localStorage
- No backend database or multiplayer features
- Each player's progress is isolated to their browser
- Suitable for training, practice, or timed individual challenges

## Port Configuration

- **Next.js Dev Server**: Port 9002 (non-standard, set via `-p 9002` flag)
- **Genkit Dev Server**: Uses default Genkit port
- **SSRF Internal Service**: Port 3001 (simulated, not actually running)

## Environment Variables

**Required/Recommended:**
- `NEXT_PUBLIC_ADMIN_PASSWORD` - Admin password for accessing protected pages
  - Default: `evolution_admin_password`
  - **Security**: Change this in production environments!

**Optional:**
- Firebase configuration keys (if deploying to Firebase)
- Google AI API keys for Genkit
- Any external service integrations

**Setup:**
1. Copy `.env.example` to `.env.local`
2. Update the values as needed
3. `.env*` files are gitignored per `.gitignore` configuration

## Scoring System

The CTF implements a **penalty-based scoring system**:
- Players earn base points for solving challenges
- Using hints deducts points based on hint cost
- **Net Score** = Base Points - Hint Penalties
- Scoreboard displays both base score and penalties
- All hint usage is tracked in localStorage and persists across sessions

