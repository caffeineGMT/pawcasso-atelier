# UX Loading States & Skeleton Loaders Implementation

## Overview

This implementation adds comprehensive loading states, skeleton loaders, and optimistic UI updates across the Pawcasso Atelier application to improve perceived performance and user experience.

## Components Created

### Core Loading Components

#### 1. **Spinner** (`/components/Spinner.tsx`)
A reusable animated loading spinner with size variants.

**Usage:**
```tsx
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" color="text-gold" />
```

#### 2. **LoadingButton** (`/components/LoadingButton.tsx`)
Button component with integrated loading states.

**Usage:**
```tsx
<LoadingButton
  isLoading={isPending}
  loadingText="Processing..."
  variant="primary"
  onClick={handleSubmit}
>
  Submit Order
</LoadingButton>
```

**Variants:** `primary`, `secondary`, `ghost`

#### 3. **LoadingOverlay** (`/components/LoadingOverlay.tsx`)
Full-screen or container overlay with loading indicator.

**Usage:**
```tsx
<LoadingOverlay
  isLoading={isUploading}
  text="Uploading portrait..."
  fullScreen={false}
/>
```

#### 4. **ProgressBar** (`/components/ProgressBar.tsx`)
Animated progress bar with percentage display.

**Usage:**
```tsx
<ProgressBar
  progress={uploadProgress}
  showPercentage
  height="lg"
  color="bg-gradient-to-r from-gold to-gold-light"
/>
```

#### 5. **ContentLoader** (`/components/ContentLoader.tsx`)
Wrapper component handling loading, error, and empty states.

**Usage:**
```tsx
<ContentLoader
  data={orders}
  isLoading={isLoading}
  error={error}
  skeleton={<OrdersSkeleton />}
  emptyState={<NoOrdersMessage />}
>
  {(orders) => <OrderList orders={orders} />}
</ContentLoader>
```

#### 6. **OptimisticImage** (`/components/OptimisticImage.tsx`)
Image component with automatic skeleton loading and error handling.

**Usage:**
```tsx
<OptimisticImage
  src="/gallery/portrait.jpg"
  alt="Pet Portrait"
  fill
  className="object-cover"
  priority
/>
```

### Skeleton Components (`/components/skeletons/`)

#### 1. **SkeletonText**
Placeholder for text content.

```tsx
<SkeletonText lines={3} width={['w-full', 'w-3/4', 'w-1/2']} />
```

#### 2. **SkeletonCard**
Complete card skeleton with image, title, and content.

```tsx
<SkeletonCard
  hasImage
  hasTitle
  hasDescription
  descriptionLines={2}
  hasFooter
/>
```

#### 3. **SkeletonAvatar**
Avatar/profile picture skeleton.

```tsx
<SkeletonAvatar size="md" shape="circle" />
```

#### 4. **SkeletonButton**
Button placeholder skeleton.

```tsx
<SkeletonButton size="md" fullWidth />
```

### Page-Specific Skeletons

#### 1. **GallerySkeleton** (`/components/GallerySkeleton.tsx`)
Full gallery page skeleton with responsive grid.

#### 2. **BlogSkeleton** (`/components/BlogSkeleton.tsx`)
Blog listing page skeleton with featured and regular posts.

#### 3. **DashboardSkeleton** (`/components/DashboardSkeleton.tsx`)
Complete dashboard skeleton with sidebar, stats, and order cards.

#### 4. **LaunchDashboardSkeleton** (`/components/LaunchDashboardSkeleton.tsx`)
Product Hunt launch dashboard skeleton.

## Hooks

### `useOptimistic` (`/hooks/useOptimistic.ts`)

Two powerful hooks for optimistic UI updates:

#### 1. **useOptimisticAction**
Execute async actions with optimistic updates.

```tsx
const { execute, isPending, data, error } = useOptimisticAction(
  createOrder,
  (result) => console.log('Success:', result),
  (err) => console.error('Error:', err)
);

await execute(orderData);
```

#### 2. **useOptimisticList**
Manage lists with optimistic updates.

```tsx
const { items, addOptimistic, removeOptimistic, confirmOptimistic, isOptimistic } =
  useOptimisticList(initialOrders);

// Add optimistic item
const tempId = `temp-${Date.now()}`;
addOptimistic({ id: tempId, ...newOrder });

// Confirm with real data
confirmOptimistic(tempId, realOrder);

// Or remove on error
removeOptimistic(tempId);
```

## Loading Pages

Next.js 13+ automatic loading UI using `loading.tsx` files:

- `/app/gallery/loading.tsx` - Gallery page loading state
- `/app/blog/loading.tsx` - Blog page loading state
- `/app/dashboard/loading.tsx` - Dashboard loading state
- `/app/launch/dashboard/loading.tsx` - Launch dashboard loading state

These files are automatically shown by Next.js during page transitions and data fetching.

## Implementation Examples

### Gallery Page
```tsx
// Automatic skeleton on navigation
export default function GalleryPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading ? (
        <GallerySkeleton />
      ) : (
        <GalleryGrid artworks={filtered} />
      )}
    </div>
  );
}
```

### Dashboard with Optimistic Updates
```tsx
const { items: orders, addOptimistic, confirmOptimistic } = useOptimisticList(initialOrders);

const handleCreateOrder = async (orderData) => {
  const tempId = `temp-${Date.now()}`;

  // Show immediately
  addOptimistic({ id: tempId, ...orderData, status: 'pending' });

  try {
    const realOrder = await createOrderAPI(orderData);
    confirmOptimistic(tempId, realOrder);
  } catch (error) {
    removeOptimistic(tempId);
    showError(error);
  }
};
```

### Image Gallery with Progressive Loading
```tsx
{portraits.map((portrait) => (
  <div key={portrait.id} className="aspect-square relative">
    <OptimisticImage
      src={portrait.url}
      alt={portrait.alt}
      fill
      className="object-cover rounded-lg"
    />
  </div>
))}
```

## Performance Features

### 1. **Staggered Animations**
Skeleton items animate in with delays for a natural feel:

```tsx
style={{ animationDelay: `${idx * 0.1}s` }}
```

### 2. **Shimmer Effects**
CSS-based shimmer animations for loading placeholders:

```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### 3. **Pulse Animations**
Subtle pulse effect for skeleton boxes:

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### 4. **Progressive Image Loading**
Images show skeleton → load → fade in smoothly.

### 5. **Optimistic UI**
Actions complete instantly in the UI, then sync with server.

## Best Practices

### When to Use Each Component

**Spinner:**
- Small inline loading states
- Button loading indicators
- List item updates

**LoadingButton:**
- Form submissions
- Action buttons
- Download/upload triggers

**LoadingOverlay:**
- File uploads
- Long-running operations
- Full-page transitions

**ProgressBar:**
- Upload progress
- Multi-step forms
- Task completion

**Skeleton Loaders:**
- Page initial loads
- Route transitions
- Data fetching

**Optimistic Updates:**
- Creating new items
- Updating existing data
- Deleting items

### Performance Tips

1. **Use `loading.tsx` for automatic route-level loading**
2. **Prefer skeletons over spinners** for better perceived performance
3. **Match skeleton layout to actual content** for smooth transitions
4. **Use optimistic updates for instant feedback**
5. **Show progress bars for long operations** (>2 seconds)
6. **Stagger animations** to avoid overwhelming users

### Accessibility

All loading components include:
- Proper ARIA labels
- Screen reader announcements
- Keyboard accessibility
- High contrast support

## Migration Guide

### Before (old approach):
```tsx
{isLoading ? (
  <div>Loading...</div>
) : (
  <OrderList orders={orders} />
)}
```

### After (new approach):
```tsx
<ContentLoader
  data={orders}
  isLoading={isLoading}
  skeleton={<OrdersSkeleton />}
>
  {(orders) => <OrderList orders={orders} />}
</ContentLoader>
```

## Testing

To test loading states in development:

```tsx
// Add artificial delay
useEffect(() => {
  const timer = setTimeout(() => setIsLoading(false), 2000);
  return () => clearTimeout(timer);
}, []);
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS animations with fallbacks
- Graceful degradation for older browsers

## Future Enhancements

- [ ] Add custom skeleton builder tool
- [ ] Implement skeleton auto-generation from components
- [ ] Add A/B testing for different loading strategies
- [ ] Create loading state analytics
- [ ] Add more animation presets

## Resources

- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [React useTransition](https://react.dev/reference/react/useTransition)
- [Optimistic UI Patterns](https://www.patterns.dev/posts/optimistic-ui-pattern)
