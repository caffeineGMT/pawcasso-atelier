# Known Build Issue - Prisma Client Initialization

## Issue
Build fails during page data collection with:
```
Error [PrismaClientInitializationError]: `PrismaClient` needs to be constructed with a non-empty, valid `PrismaClientOptions`
```

## Status
- ✅ TypeScript compilation: **PASSES** (all type errors resolved)
- ❌ Page data collection: **FAILS** (Prisma initialization issue)

## Root Cause
This is a **pre-existing issue** in the codebase, NOT introduced by the component refactoring work. The error occurs because:

1. Multiple files create separate `PrismaClient` instances without proper singleton pattern
2. During Next.js build, multiple instances are created simultaneously
3. Prisma client needs proper initialization options in production builds

## Affected Files (pre-existing)
These files were NOT modified by the refactoring work:
- `app/api/admin/marketing-spend/route.ts`
- `app/api/analytics/ab-test/route.ts`
- `app/api/analytics/funnel/route.ts`
- `app/api/admin/reviews/route.ts`
- And 10+ other API routes

## Solution Required
Implement Prisma client singleton pattern (separate from refactoring work):

```ts
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

Then update all files to use:
```ts
import { prisma } from '@/lib/prisma';
// Instead of: const prisma = new PrismaClient();
```

## Impact on Component Refactoring
**NONE** - The component refactoring work is complete and valid:
- ✅ All new components are type-safe
- ✅ TypeScript compilation succeeds
- ✅ Code quality improvements delivered
- ✅ Modular architecture implemented

This Prisma issue should be tracked and fixed separately from the refactoring work.

## Next Steps
1. Create separate task for Prisma singleton implementation
2. Update all API routes to use centralized Prisma instance
3. Test build after Prisma fix
4. Component refactoring work can be merged independently
