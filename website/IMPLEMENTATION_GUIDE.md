# Error Handling & User Feedback Implementation Guide

This guide documents the comprehensive error handling and user feedback system implemented for Pawcasso Atelier.

## Overview

The implementation provides:
- ✅ Centralized error handling with custom error types
- ✅ Form validation with real-time feedback
- ✅ API client with automatic retry and timeout
- ✅ Toast notifications for success/error/warning/info
- ✅ Error boundaries for React component errors
- ✅ Network status detection
- ✅ Loading states and spinners
- ✅ User-friendly error messages
- ✅ Error recovery mechanisms

## Core Components

### 1. Error Handling (`src/lib/errors.ts`)

Centralized error management with custom error types and user-friendly messages.

```typescript
import { AppError, ErrorType, parseError, getUserErrorMessage } from '@/lib/errors';

// Create custom error
throw new AppError(
  'Technical error message',
  ErrorType.VALIDATION,
  'User-friendly message'
);

// Parse any error
const error = parseError(unknownError);
console.log(error.userMessage); // User-friendly message
```

### 2. Form Validation (`src/lib/validation.ts`)

Comprehensive validation utilities for forms.

```typescript
import { validateEmail, validateOrderForm } from '@/lib/validation';

// Validate individual field
const result = validateEmail('user@example.com');
if (!result.valid) {
  console.log(result.error); // Error message
}

// Validate entire form
const formValidation = validateOrderForm(formData);
if (!formValidation.valid) {
  console.log(formValidation.errors); // { email: 'Error...', name: 'Error...' }
}
```

### 3. API Client (`src/lib/api-client.ts`)

Enhanced fetch client with retry, timeout, and error handling.

```typescript
import { api } from '@/lib/api-client';

// GET request
const data = await api.get('/api/orders');

// POST request with retry
const result = await api.post('/api/checkout', {
  name: 'John',
  email: 'john@example.com'
}, {
  retries: 3,
  timeout: 30000
});

// Upload file with progress
const upload = await api.upload('/api/upload', formData);
```

### 4. Toast Hook (`src/hooks/useToast.ts`)

Enhanced toast notifications with error parsing.

```typescript
import { useToast } from '@/hooks/useToast';

const toast = useToast();

// Success
toast.success('Order created successfully!');

// Error (auto-parses errors)
toast.error(error); // or toast.error('Error message')

// Warning
toast.warning('Limited time offer expires soon');

// Promise with loading state
toast.promise(
  api.post('/api/checkout', data),
  {
    loading: 'Creating order...',
    success: 'Order created!',
    error: 'Failed to create order'
  }
);
```

### 5. Form Validation Hook (`src/hooks/useFormValidation.ts`)

Real-time form validation with touched state.

```typescript
import { useFormValidation } from '@/hooks/useFormValidation';

const {
  errors,
  touched,
  handleBlur,
  handleChange,
  getFieldError
} = useFormValidation();

// On input change
<input
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    handleChange('email', e.target.value);
  }}
  onBlur={() => handleBlur('email', email)}
/>

// Show error only if touched
{getFieldError('email') && <ErrorMessage error={getFieldError('email')} />}
```

### 6. Async Hook (`src/hooks/useAsync.ts`)

Handle async operations with loading/error/data states.

```typescript
import { useAsync } from '@/hooks/useAsync';

const { data, error, loading, execute } = useAsync(
  async (orderId: string) => {
    return api.get(`/api/orders/${orderId}`);
  },
  {
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.log('Error:', error)
  }
);

// Trigger execution
<button onClick={() => execute('123')}>Load Order</button>
```

## UI Components

### Error Boundary

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Alert Component

```typescript
import { Alert } from '@/components/Alert';

<Alert variant="error" title="Upload Failed">
  Your file is too large. Please choose a smaller image.
</Alert>

<Alert variant="success">Order created successfully!</Alert>
<Alert variant="warning">Limited time offer expires soon</Alert>
<Alert variant="info">Your portrait will be ready in 24 hours</Alert>
```

### Form Field with Validation

```typescript
import { FormField } from '@/components/FormField';

<FormField
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>
```

### Error Message

```typescript
import { ErrorMessage } from '@/components/ErrorMessage';

<ErrorMessage error={uploadError} />
```

### Success Message

```typescript
import { SuccessMessage } from '@/components/SuccessMessage';

<SuccessMessage message="Photo uploaded successfully!" />
```

### Loading Spinner

```typescript
import { Spinner } from '@/components/Spinner';

{loading && <Spinner size="lg" label="Loading..." />}
```

### Retry Button

```typescript
import { RetryButton } from '@/components/RetryButton';

<RetryButton
  onRetry={async () => {
    await api.post('/api/checkout', data);
  }}
  maxRetries={3}
>
  Retry Payment
</RetryButton>
```

### Network Status

```typescript
import { NetworkStatus } from '@/components/NetworkStatus';

// In layout.tsx
<body>
  <NetworkStatus />
  {children}
</body>
```

## Complete Form Example

```typescript
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { validateOrderForm } from '@/lib/validation';
import { api } from '@/lib/api-client';
import { FormField } from '@/components/FormField';
import { Alert } from '@/components/Alert';
import LoadingButton from '@/components/LoadingButton';

export function OrderForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const {
    errors,
    handleBlur,
    handleChange,
    setMultipleErrors,
    getFieldError
  } = useFormValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateOrderForm({ name, email, /* ... */ });
    if (!validation.valid) {
      setMultipleErrors(validation.errors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const result = await api.post('/api/checkout', {
        name,
        email,
      });

      toast.success('Order created successfully!');
      // Redirect or handle success
    } catch (error) {
      toast.error(error); // Auto-parsed and user-friendly
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Name"
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          handleChange('name', e.target.value);
        }}
        onBlur={() => handleBlur('name', name)}
        error={getFieldError('name')}
        required
      />

      <FormField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          handleChange('email', e.target.value);
        }}
        onBlur={() => handleBlur('email', email)}
        error={getFieldError('email')}
        required
      />

      <LoadingButton
        type="submit"
        isLoading={loading}
        loadingText="Creating order..."
      >
        Place Order
      </LoadingButton>
    </form>
  );
}
```

## API Route Error Handling

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AppError, ErrorType } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation error
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Do something...
    const result = await processOrder(body);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('API Error:', error);

    // Return user-friendly error
    return NextResponse.json(
      { error: 'Failed to process order. Please try again.' },
      { status: 500 }
    );
  }
}
```

## Error Types

- `VALIDATION` - Form validation errors
- `NETWORK` - Network connectivity issues
- `API` - Server/API errors
- `UPLOAD` - File upload errors
- `PAYMENT` - Payment processing errors
- `AUTH` - Authentication errors
- `UNKNOWN` - Unknown errors

## Best Practices

1. **Always use try-catch** around async operations
2. **Validate user input** before API calls
3. **Show loading states** during async operations
4. **Provide retry mechanisms** for recoverable errors
5. **Log errors** for debugging (already handled by error utilities)
6. **Use user-friendly messages** (provided by error types)
7. **Handle edge cases** (network offline, timeouts, etc.)
8. **Test error scenarios** to ensure proper UX

## Future Enhancements

- [ ] Integrate with error tracking service (Sentry, LogRocket)
- [ ] Add analytics for error tracking
- [ ] Implement error recovery suggestions
- [ ] Add offline mode with queue
- [ ] Enhanced retry logic with exponential backoff UI feedback
