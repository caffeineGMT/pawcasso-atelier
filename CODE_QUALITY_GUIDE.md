# Code Quality & Best Practices Guide

## Component Structure

### ✅ DO: Small, Focused Components
```tsx
// Good - Single responsibility, ~100 lines
export default function CustomerInfoSection({ name, email, onChange }: Props) {
  return (
    <div className="space-y-4">
      <Input label="Name" value={name} onChange={(e) => onChange('name', e.target.value)} />
      <Input label="Email" value={email} onChange={(e) => onChange('email', e.target.value)} />
    </div>
  );
}
```

### ❌ DON'T: Monolithic Components
```tsx
// Bad - Multiple responsibilities, 1000+ lines
export default function OrderPage() {
  // 50+ useState hooks
  // API calls
  // Validation logic
  // Complex JSX
  // ... 1000 more lines
}
```

## API Client Pattern

### ✅ DO: Centralized API Client
```tsx
// Good - Reusable, type-safe, with error handling
import { api } from '@/lib/api-client';

export const checkoutApi = {
  createSession: (data: CheckoutData) => api.post('/api/checkout', data),
};

// Usage
const result = await checkoutApi.createSession(formData);
```

### ❌ DON'T: Scattered Fetch Calls
```tsx
// Bad - Duplicate code, no error handling, no types
const res = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
if (!res.ok) throw new Error('Failed');
const json = await res.json();
```

## Form Validation

### ✅ DO: Zod Schemas
```tsx
// Good - Type-safe, reusable, runtime validation
import { z } from 'zod';

const orderSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name too short'),
});

type OrderData = z.infer<typeof orderSchema>;
```

### ❌ DON'T: Inline Validation
```tsx
// Bad - Fragile, untestable, no types
if (!email.includes('@')) {
  setError('Invalid email');
}
if (name.length < 2) {
  setError('Name too short');
}
```

## State Management

### ✅ DO: Custom Hooks for Complex State
```tsx
// Good - Encapsulated logic, reusable
function useOrderForm() {
  const [state, setState] = useState(initialState);
  const handleSubmit = () => { /* logic */ };
  return { state, setState, handleSubmit };
}
```

### ❌ DON'T: 20+ useState in One Component
```tsx
// Bad - Hard to manage, prop drilling
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [petName, setPetName] = useState('');
// ... 20 more useState
```

## Configuration

### ✅ DO: Separate Config Files
```tsx
// lib/stripe/webhook-config.ts
export const TIER_PORTRAIT_COUNT = {
  basic: 1,
  premium: 3,
  deluxe: 5,
};
```

### ❌ DON'T: Magic Numbers in Code
```tsx
// Bad - Hard to maintain, unclear intent
if (tier === 'premium') {
  generatePortraits(3); // Why 3?
}
```

## Error Handling

### ✅ DO: Typed Error Classes
```tsx
// Good - Structured, informative
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
  }
}
```

### ❌ DON'T: Generic Error Messages
```tsx
// Bad - Unclear, not actionable
catch (err) {
  console.error('Something went wrong');
}
```

## File Organization

### ✅ DO: Feature-Based Structure
```
src/
├── components/
│   ├── order/           # Order-specific components
│   │   ├── CustomerInfoSection.tsx
│   │   ├── OrderSummary.tsx
│   │   └── index.ts     # Barrel export
├── lib/
│   ├── api/             # API clients
│   ├── stripe/          # Stripe utilities
│   └── validation.ts    # Shared validation
```

### ❌ DON'T: Flat Structure
```
src/
├── component1.tsx
├── component2.tsx
├── component3.tsx
├── ... 50 more files
```

## TypeScript Best Practices

### ✅ DO: Explicit Types
```tsx
interface CustomerInfoProps {
  name: string;
  email: string;
  onSubmit: (data: FormData) => Promise<void>;
}
```

### ❌ DON'T: `any` Types
```tsx
function handleSubmit(data: any) {  // Bad
  // No type safety
}
```

## Naming Conventions

### ✅ DO: Descriptive Names
```tsx
// Good
function validateEmailFormat(email: string): boolean
const isCheckoutComplete = true;
```

### ❌ DON'T: Abbreviations
```tsx
// Bad
function valEmail(e: string)
const chkDone = true;
```

## Testing Strategy

### Unit Tests
- Test individual utility functions
- Test validation schemas
- Test API client methods

### Integration Tests
- Test component interactions
- Test form submissions
- Test API routes

### E2E Tests (Playwright)
- Test critical user flows
- Test payment processing
- Test order completion

## Code Review Checklist

- [ ] Component is under 200 lines
- [ ] No duplicate code
- [ ] Props are typed
- [ ] Error handling is present
- [ ] No magic numbers
- [ ] Functions have single responsibility
- [ ] Imports are organized
- [ ] No commented-out code
- [ ] TypeScript strict mode passes
- [ ] Build succeeds with zero warnings

## Metrics to Track

### Component Health
- **Lines of Code:** Target < 200 per component
- **Cyclomatic Complexity:** Target < 10
- **Props Count:** Target < 8 per component

### Code Quality
- **TypeScript Coverage:** 100%
- **Test Coverage:** > 80% for critical paths
- **Build Warnings:** 0
- **ESLint Errors:** 0

### Performance
- **Bundle Size:** Monitor with `npm run analyze`
- **Lighthouse Score:** > 90 for all metrics
- **Core Web Vitals:** All green

## Resources

- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
- [Next.js Best Practices](https://nextjs.org/docs)
