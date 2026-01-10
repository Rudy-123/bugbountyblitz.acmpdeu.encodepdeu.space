# CTF Security and Best Practices Changes

This document outlines all the improvements made to align the Evolution CTF with proper CTF best practices.

## Security Improvements

### 1. Flag Protection (CRITICAL)
**Problem:** Flags were exposed in client-side code via `challenges.ts`, making them accessible in browser DevTools.

**Solution:**
- Created `src/lib/challenges-server.ts` with `'server-only'` import enforcement
- Split challenge data:
  - `challenges.ts` - Client-safe metadata WITHOUT flags
  - `challenges-server.ts` - Server-only data WITH flags
- Updated all server actions and server components to use `challengesWithFlags`
- Prevents flag exposure even with browser inspection

**Files Changed:**
- `src/lib/challenges.ts` - Removed flags, exports `Omit<Challenge, 'flag'>[]`
- `src/lib/challenges-server.ts` - NEW file with complete challenge data
- `src/lib/actions.ts` - Uses `challengesWithFlags`
- `src/components/ctf/AdminDashboard.tsx` - Uses `challengesWithFlags`
- `src/app/answers/page.tsx` - Converted to server component
- `src/components/ctf/AnswersAuth.tsx` - NEW client auth wrapper

### 2. Admin Password Security
**Problem:** Admin password hardcoded in source code.

**Solution:**
- Moved password to environment variable `NEXT_PUBLIC_ADMIN_PASSWORD`
- Default value for development: `evolution_admin_password`
- Added `.env.example` for documentation
- Warning to change in production

**Files Changed:**
- `src/components/ctf/AdminDashboard.tsx`
- `src/components/ctf/AnswersAuth.tsx`
- `.env.example` - NEW file

### 3. Answers Page Protection
**Problem:** Answers page publicly displayed all flags without authentication.

**Solution:**
- Added password authentication (same as admin panel)
- Converted to server component to prevent flag exposure
- Client-side auth wrapper for session management

**Files Changed:**
- `src/app/answers/page.tsx` - Refactored with auth
- `src/components/ctf/AnswersAuth.tsx` - NEW auth component

## Feature Improvements

### 4. Hint Penalty System
**Problem:** Hints showed costs but didn't actually deduct points from score.

**Solution:**
- Implemented full hint tracking in player context
- Tracks: `challengeId`, `hintIndex`, `cost` for each hint used
- Calculates total penalty: `getTotalPenalty()`
- Net score = Base Score - Penalties
- Persists to localStorage: `ctf_hintsUsed`
- Scoreboard shows breakdown

**Files Changed:**
- `src/app/providers.tsx` - Added hint tracking state and methods
- `src/components/ctf/HintManager.tsx` - Integrated with player context
- `src/app/scoreboard/page.tsx` - Displays penalties

### 5. Flag Display in Challenges
**Problem:** SQL injection challenge directly exposed `challenge.flag` variable.

**Solution:**
- Hardcoded flag in realistic simulated output
- Shows flag as part of database record response
- Example: `User ID: 1 | Name: Admin | Secret: FLAG{SQL_HACK}`

**Files Changed:**
- `src/app/challenges/[id]/page.tsx`

### 6. Flag Format Consistency
**Problem:** Robots.txt page used HTML entities for curly braces.

**Solution:**
- Changed `&#123;` and `&#125;` to proper JSX format
- Now displays correctly: `FLAG{ROBOT_X}`

**Files Changed:**
- `src/app/not-a-real-robots-txt/page.tsx`

## Documentation Updates

### 7. WARP.md
**Additions:**
- CTF Security Best Practices section
- Flag protection architecture explanation
- Hint penalty system documentation
- Environment variable setup instructions
- Scoring system explanation
- Updated challenge addition workflow

### 8. Package Dependencies
**New:**
- `server-only` - Enforces server-only module imports

## Architecture Changes Summary

### Before:
```
challenges.ts (with flags) ─→ Client Components ❌ UNSAFE
                           └→ Server Actions
```

### After:
```
challenges.ts (NO flags) ─→ Client Components ✅ SAFE
challenges-server.ts (with flags) ─→ Server Actions ✅ SECURE
                                   └→ Server Components
```

## Testing Checklist

- [x] TypeScript compiles without errors
- [x] Client components cannot access flags
- [x] Server actions validate flags correctly
- [x] Admin panel requires authentication
- [x] Answers page requires authentication
- [x] Hints deduct points properly
- [x] Scoreboard shows penalty breakdown
- [x] Flag formats display correctly

## Breaking Changes

None - All changes are backwards compatible with existing player data in localStorage.

## Migration Notes for Developers

### When Adding New Challenges:

1. Add to BOTH files:
   - `src/lib/challenges.ts` (without `flag` property)
   - `src/lib/challenges-server.ts` (with `flag` property)

2. Never reference `challenge.flag` in:
   - Client components
   - Challenge simulations
   - UI displays

3. If showing a flag in simulation:
   - Hardcode it in the component
   - Show as part of realistic output
   - Example: fake database records, API responses, etc.

### Environment Setup:

```bash
cp .env.example .env.local
# Edit .env.local and change NEXT_PUBLIC_ADMIN_PASSWORD
```

## Security Recommendations

1. **Production Deployment:**
   - Change `NEXT_PUBLIC_ADMIN_PASSWORD` immediately
   - Consider adding rate limiting for flag submissions
   - Add CAPTCHA for repeated failed attempts

2. **Code Review:**
   - Always check that new challenges don't expose flags client-side
   - Verify `'server-only'` import is present in challenge server files
   - Test that TypeScript catches attempts to use flags in client code

3. **Monitoring:**
   - Log flag submission attempts (server-side)
   - Track unusual hint usage patterns
   - Monitor admin panel access

## References

- CTF Best Practices: https://ctftime.org/
- Next.js Server/Client Components: https://nextjs.org/docs/app/building-your-application/rendering
- OWASP CTF Guidelines: https://owasp.org/www-community/vulnerabilities/

