"use client";

/**
 * OPTIMISTIC UI EXAMPLES
 *
 * This file demonstrates how to use the optimistic UI components
 * throughout the Pawcasso Atelier application.
 *
 * DO NOT IMPORT THIS FILE IN PRODUCTION - IT'S FOR REFERENCE ONLY
 */

import { useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import Spinner from "@/components/Spinner";
import LoadingOverlay from "@/components/LoadingOverlay";
import ContentLoader from "@/components/ContentLoader";
import ProgressBar from "@/components/ProgressBar";
import OptimisticImage from "@/components/OptimisticImage";
import { useOptimisticAction, useOptimisticList } from "@/hooks/useOptimistic";
import { SkeletonText, SkeletonCard, SkeletonAvatar, SkeletonButton } from "@/components/skeletons";

// Example 1: Loading Button
export function LoadingButtonExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <LoadingButton
        isLoading={isLoading}
        onClick={handleSubmit}
        loadingText="Processing..."
        variant="primary"
      >
        Submit Order
      </LoadingButton>

      <LoadingButton
        isLoading={isLoading}
        onClick={handleSubmit}
        variant="secondary"
      >
        Cancel
      </LoadingButton>
    </div>
  );
}

// Example 2: Optimistic Action Hook
export function OptimisticActionExample() {
  const createOrder = async (petName: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: Math.random().toString(), petName, status: 'pending' };
  };

  const { execute, isPending, data, error } = useOptimisticAction(
    createOrder,
    (result) => console.log('Order created:', result),
    (err) => console.error('Error:', err)
  );

  return (
    <div>
      <button
        onClick={() => execute('Buddy')}
        disabled={isPending}
        className="px-4 py-2 bg-gold text-background rounded-full"
      >
        {isPending ? 'Creating...' : 'Create Order'}
      </button>
      {data && <p>Order created: {data.petName}</p>}
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}

// Example 3: Optimistic List Hook
export function OptimisticListExample() {
  const { items, addOptimistic, removeOptimistic, confirmOptimistic, isOptimistic } =
    useOptimisticList([
      { id: '1', name: 'Portrait 1' },
      { id: '2', name: 'Portrait 2' },
    ]);

  const handleAddPortrait = async () => {
    const tempId = `temp-${Date.now()}`;
    const optimisticItem = { id: tempId, name: 'New Portrait (uploading...)' };

    // Add optimistically
    addOptimistic(optimisticItem);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      const actualItem = { id: 'real-id', name: 'New Portrait' };

      // Replace with real data
      confirmOptimistic(tempId, actualItem);
    } catch (error) {
      // Remove on error
      removeOptimistic(tempId);
    }
  };

  return (
    <div>
      <button onClick={handleAddPortrait} className="mb-4 px-4 py-2 bg-gold text-background rounded-full">
        Add Portrait
      </button>
      <ul className="space-y-2">
        {items.map(item => (
          <li
            key={item.id}
            className={isOptimistic(item.id) ? 'opacity-50' : ''}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Example 4: Content Loader
export function ContentLoaderExample() {
  const [data, setData] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Simulate data fetch
  setTimeout(() => {
    setIsLoading(false);
    setData(['Item 1', 'Item 2', 'Item 3']);
  }, 2000);

  return (
    <ContentLoader
      data={data}
      isLoading={isLoading}
      error={error}
      skeleton={<SkeletonCard />}
      emptyState={<p>No items found</p>}
    >
      {(items) => (
        <ul>
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </ContentLoader>
  );
}

// Example 5: Progress Bar
export function ProgressBarExample() {
  const [progress, setProgress] = useState(0);

  // Simulate progress
  if (progress < 100) {
    setTimeout(() => setProgress(prev => Math.min(prev + 10, 100)), 500);
  }

  return (
    <div className="space-y-4">
      <ProgressBar progress={progress} showPercentage />
      <ProgressBar progress={progress} height="lg" color="bg-gradient-to-r from-green-500 to-emerald-500" />
    </div>
  );
}

// Example 6: Loading Overlay
export function LoadingOverlayExample() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="relative h-96 bg-gray-100 rounded-lg">
      <LoadingOverlay isLoading={isUploading} text="Uploading portrait..." />
      <button
        onClick={() => setIsUploading(!isUploading)}
        className="px-4 py-2 bg-gold text-background rounded-full"
      >
        Toggle Upload
      </button>
    </div>
  );
}

// Example 7: Skeleton Components
export function SkeletonExamples() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4">Skeleton Text</h3>
        <SkeletonText lines={3} width={['w-full', 'w-3/4', 'w-1/2']} />
      </div>

      <div>
        <h3 className="mb-4">Skeleton Card</h3>
        <SkeletonCard hasImage hasTitle hasDescription hasFooter />
      </div>

      <div>
        <h3 className="mb-4">Skeleton Avatar</h3>
        <div className="flex gap-4">
          <SkeletonAvatar size="sm" />
          <SkeletonAvatar size="md" />
          <SkeletonAvatar size="lg" />
          <SkeletonAvatar size="xl" shape="square" />
        </div>
      </div>

      <div>
        <h3 className="mb-4">Skeleton Button</h3>
        <div className="flex gap-4">
          <SkeletonButton size="sm" />
          <SkeletonButton size="md" />
          <SkeletonButton size="lg" />
        </div>
      </div>
    </div>
  );
}

// Example 8: Optimistic Image
export function OptimisticImageExample() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="aspect-square relative rounded-lg overflow-hidden">
          <OptimisticImage
            src={`/gallery/portrait-${i}.jpg`}
            alt={`Portrait ${i}`}
            fill
            className="object-cover"
            priority={i <= 3}
          />
        </div>
      ))}
    </div>
  );
}
