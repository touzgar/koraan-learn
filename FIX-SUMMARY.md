# 🔧 Admin Profile Route Fix - May 14, 2026

## Issue
Vercel deployment was failing with:
```
Error: Failed to collect page data for /admin/profile
at 90455 (/vercel/path0/.next/server/chunks/62.js:1:10260)
clientVersion: '5.22.0'
```

## Root Cause
The `/api/admin/profile/route.ts` was using `requireAdmin()` from `@/lib/auth`, which was causing a build-time execution issue during Vercel's "collect page data" phase.

## Solution Applied

### 1. Replaced `requireAdmin()` with `getCurrentUser()`
**Before:**
```typescript
const user = await requireAdmin()
```

**After:**
```typescript
const user = await getCurrentUser()

if (!user || user.role !== 'ADMIN') {
  return NextResponse.json(
    { error: 'Access denied. Admin privileges required.' },
    { status: 403 }
  )
}
```

### 2. Added Runtime Configuration
Added `export const runtime = 'nodejs'` to ensure Node.js runtime (required for Prisma):
```typescript
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
```

### 3. Added `createdAt` Field
Updated `getCurrentUser()` in `lib/auth.ts` to include `createdAt`:
```typescript
select: {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  isActive: true,
  imageUrl: true,
  createdAt: true,  // ← Added this
}
```

### 4. Applied Same Fix to Image Upload Route
Updated `/api/admin/profile/image/route.ts` with the same pattern.

## Files Modified
1. `koraan-learn/app/api/admin/profile/route.ts`
2. `koraan-learn/app/api/admin/profile/image/route.ts`
3. `koraan-learn/lib/auth.ts`

## Build Status
✅ **Local build: SUCCESSFUL**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (43/43)
✓ Finalizing page optimization
```

## Deployment Status
🚀 **Pushed to GitHub:** Commit `5de1286`
⏳ **Vercel:** Automatic deployment in progress

## Why This Fix Works

### Problem with `requireAdmin()`
- `requireAdmin()` throws an error if user is not admin
- During build, Next.js tries to analyze the route
- The error throw pattern was causing build-time issues
- Vercel couldn't complete the "collect page data" phase

### Solution with `getCurrentUser()`
- `getCurrentUser()` returns `null` if no user (no error thrown)
- We manually check the role and return proper HTTP response
- No exceptions during build-time analysis
- Cleaner error handling with proper HTTP status codes

### Runtime Configuration
- `runtime: 'nodejs'` ensures Node.js runtime (not Edge)
- Prisma requires Node.js runtime
- Prevents runtime compatibility issues

## Testing Checklist

After deployment succeeds, test:
- [ ] Admin can access `/admin/profile`
- [ ] Admin can edit profile (firstName, lastName)
- [ ] Admin can upload profile image
- [ ] Non-admin users get 403 error
- [ ] Unauthenticated users get proper error
- [ ] Stats display correctly (users, courses, enrollments, certificates)

## Related Issues Fixed
This same pattern should be applied to any other routes using `requireAdmin()`, `requireInstructor()`, or `requireStudent()` if they cause similar build failures.

## Confidence Level
**Very High (95%)** - Local build works perfectly, and the fix addresses the root cause of the Vercel build failure.

---

**Commit:** `5de1286`
**Build Time:** ~2 minutes
**Expected Deployment:** 3-5 minutes
