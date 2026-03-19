# Error Handling & User Feedback System

Comprehensive error handling, toast notifications, form validation, and network recovery for Pawcasso Atelier.

## Features

### 1. Error Boundaries
- Catches React component errors
- Shows user-friendly fallback UI
- Automatic error logging
- Recovery actions (retry, go home)

### 2. Toast Notifications
- Success, error, warning, info, loading states
- Automatic retry actions for recoverable errors
- Custom styling with dark theme
- Non-intrusive, accessible notifications

### 3. Form Validation
- Zod-based schema validation
- Real-time error feedback
- User-friendly error messages
- Field-level validation clearing

### 4. Network Error Handling
- Automatic retry with exponential backoff
- Online/offline detection
- Visual network status indicator
- Graceful degradation

### 5. API Client
- Automatic retry logic (up to 3 retries)
- Timeout handling (30s default)
- Request cancellation
- Error toast notifications

## Usage

### Error Boundary

Wrap components that might throw errors:

```tsx
import { ErrorBoundary } from "@/components/ErrorBoundary";

<ErrorBoundary
  fallback={<CustomErrorUI />}
  onError={(error, errorInfo) => {
    // Custom error handling
    console.log("Error caught:", error);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### Toast Notifications

```tsx
import { toast } from "sonner";

// Success
toast.success("Order placed!", {
  description: "Your pet portrait is being created",
});

// Error
toast.error("Payment failed", {
  description: "Please check your card details",
  action: {
    label: "Retry",
    onClick: () => retryPayment(),
  },
});

// Loading
toast.loading("Processing payment...", {
  id: "payment-toast",
});

// Dismiss
toast.dismiss("payment-toast");
```

### Form Validation

#### Using the useForm hook:

```tsx
import { useForm } from "@/hooks/useForm";
import { contactFormSchema } from "@/lib/form-validation";
import { Input, Textarea } from "@/components/FormInputs";

function MyForm() {
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    submitForm,
    resetForm,
  } = useForm(contactFormSchema, (data) => {
    toast.success("Form submitted!");
    resetForm();
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submitForm("/api/contact");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Name"
        value={formData.name || ""}
        onChange={handleChange("name")}
        error={errors.name}
        required
      />
      {/* More fields... */}
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
}
```

#### Manual validation:

```tsx
import { validate, emailSchema } from "@/lib/form-validation";

const result = validate(emailSchema, email);

if (!result.success) {
  console.error(result.errors); // { email: "Invalid email" }
} else {
  console.log(result.data); // "valid@email.com"
}
```

### API Requests

```tsx
import { api } from "@/lib/api-client";

// GET request
const data = await api.get("/api/orders");

// POST with retry
const result = await api.post("/api/checkout", orderData, {
  retries: 3,
  retryDelay: 1000,
  timeout: 30000,
  onRetry: (attempt, maxRetries) => {
    toast.loading(`Retrying... (${attempt}/${maxRetries})`);
  },
});

// Manual error handling
try {
  const data = await api.post("/api/contact", formData, {
    showToastOnError: false, // Disable automatic toast
  });
} catch (error) {
  // Handle error manually
  const appError = await parseError(error);
  console.error(appError);
}
```

### Error Handler Utilities

```tsx
import {
  parseError,
  showErrorToast,
  handleApiError,
  createError,
  isOnline,
  waitForOnline,
} from "@/lib/error-handler";

// Parse errors from various sources
const appError = await parseError(error);

// Show error toast
showErrorToast(appError);

// Handle API errors (parse + toast)
await handleApiError(error);

// Create custom errors
const error = createError("validation", "Email is required", {
  details: "Please enter a valid email",
  retry: false,
});

// Check online status
if (isOnline()) {
  // Make request
} else {
  await waitForOnline(); // Wait for connection
  // Make request
}
```

### Network Status

The `NetworkStatus` component is automatically included in the layout and shows a banner when offline.

## Validation Schemas

Pre-built schemas in `lib/form-validation.ts`:

- `emailSchema` - Email validation
- `nameSchema` - Name validation (letters, spaces, hyphens)
- `petNameSchema` - Pet name validation
- `phoneSchema` - Phone number validation
- `urlSchema` - URL validation
- `imageFileSchema` - Image file validation (max 10MB, JPEG/PNG/WebP)
- `orderFormSchema` - Complete order form
- `corporateQuoteSchema` - Corporate quote request
- `emailSignupSchema` - Email signup
- `contactFormSchema` - Contact form

## Form Input Components

Accessible form inputs with validation feedback:

```tsx
import { Input, Textarea, Select } from "@/components/FormInputs";

<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  hint="We'll never share your email"
  required
  disabled={isSubmitting}
/>

<Textarea
  label="Message"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  error={errors.message}
  rows={6}
/>

<Select
  label="Style"
  value={style}
  onChange={(e) => setStyle(e.target.value)}
  options={[
    { value: "renaissance", label: "Renaissance" },
    { value: "baroque", label: "Baroque" },
  ]}
  error={errors.style}
/>
```

## API Error Handling

All API routes should follow this pattern:

```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  // Define schema
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.errors },
        { status: 400 }
      );
    }

    // Process
    const data = result.data;
    // ... do work

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("API error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## Best Practices

1. **Always validate user input** - Use Zod schemas for type-safe validation
2. **Handle errors gracefully** - Show user-friendly messages, not stack traces
3. **Provide retry actions** - For recoverable errors (network, timeout, server errors)
4. **Clear errors on user input** - Remove field errors when user starts typing
5. **Disable forms during submission** - Prevent double submissions
6. **Show loading states** - Use toast.loading() or button spinners
7. **Test offline behavior** - Use Chrome DevTools Network throttling
8. **Log errors in production** - TODO: Add Sentry integration

## Toast Styling

Custom toast styles are in `app/toast.css`. Toasts use the dark theme with:
- Success: green (#22c55e)
- Error: red (#ef4444)
- Warning: orange (#f59e0b)
- Info: blue (#3b82f6)
- Loading: indigo (#6366f1)

## Error Types

- `network` - Network connectivity issues
- `validation` - User input validation errors
- `authentication` - User not authenticated
- `authorization` - User not authorized
- `not_found` - Resource not found (404)
- `server` - Server error (5xx)
- `timeout` - Request timeout
- `unknown` - Unexpected errors

## Examples

See `components/ContactForm.tsx` for a complete example with all features.

## Future Enhancements

- [ ] Add Sentry error tracking
- [ ] Implement error analytics
- [ ] Add rate limiting error handling
- [ ] Create error recovery suggestions
- [ ] Add accessibility announcements for errors
