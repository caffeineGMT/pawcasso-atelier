"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";

// Experiment variant types
export type UpsellTimingVariant = 'control' | 'fast' | 'delayed' | 'exit-intent';

export interface ExperimentConfig {
  'upsell-modal-timing': {
    control: number;        // 2000ms
    fast: number;          // 500ms
    delayed: number;       // 5000ms
    'exit-intent': string; // 'mouseleave'
  };
}

// Default experiment configurations
const EXPERIMENT_DEFAULTS: ExperimentConfig = {
  'upsell-modal-timing': {
    control: 2000,
    fast: 500,
    delayed: 5000,
    'exit-intent': 'mouseleave',
  },
};

// Helper to get variant from Edge Config or fallback to A/B assignment
async function getVariantFromEdgeConfig(
  experimentName: keyof ExperimentConfig
): Promise<string | null> {
  try {
    // Try to fetch from Vercel Edge Config
    const response = await fetch('/api/edge-config');
    if (!response.ok) return null;

    const config = await response.json();
    const experiment = config.experiments?.[experimentName];

    if (!experiment) return null;

    // If experiment has a winning variant set to 100%, return it
    if (experiment.winner) {
      return experiment.winner;
    }

    // Otherwise return null to trigger local A/B assignment
    return null;
  } catch (error) {
    console.error('Failed to fetch Edge Config:', error);
    return null;
  }
}

// Deterministic A/B assignment based on session ID
function assignVariant(
  experimentName: string,
  sessionId: string,
  variants: string[]
): string {
  // Use session ID to deterministically assign variant
  const hash = sessionId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const index = Math.abs(hash) % variants.length;
  return variants[index];
}

// Get or assign variant for a user
function getUserVariant(
  experimentName: keyof ExperimentConfig,
  sessionId: string
): UpsellTimingVariant {
  // Check localStorage for existing assignment
  const storageKey = `experiment_${experimentName}_${sessionId}`;
  const stored = localStorage.getItem(storageKey);

  if (stored && stored in EXPERIMENT_DEFAULTS[experimentName]) {
    return stored as UpsellTimingVariant;
  }

  // Assign new variant
  const variants = Object.keys(EXPERIMENT_DEFAULTS[experimentName]);
  const variant = assignVariant(experimentName, sessionId, variants) as UpsellTimingVariant;

  // Store assignment
  localStorage.setItem(storageKey, variant);

  return variant;
}

/**
 * Hook to use experiment variants
 * @param experimentName - Name of the experiment
 * @param defaultValue - Fallback value if experiment is not found
 * @param sessionId - Session identifier for consistent variant assignment
 * @returns The variant value (delay in ms or trigger type)
 */
export function useExperiment(
  experimentName: keyof ExperimentConfig,
  defaultValue: number | string,
  sessionId?: string
): number | string {
  const [variant, setVariant] = useState<number | string>(defaultValue);
  const [variantName, setVariantName] = useState<UpsellTimingVariant>('control');

  useEffect(() => {
    if (!sessionId) return;

    async function loadExperiment() {
      // First try Edge Config
      const edgeVariant = await getVariantFromEdgeConfig(experimentName);

      let finalVariant: UpsellTimingVariant;

      if (edgeVariant && edgeVariant in EXPERIMENT_DEFAULTS[experimentName]) {
        finalVariant = edgeVariant as UpsellTimingVariant;
      } else {
        // Fallback to local A/B assignment
        finalVariant = getUserVariant(experimentName, sessionId!);
      }

      setVariantName(finalVariant);

      const config = EXPERIMENT_DEFAULTS[experimentName];
      const value = config[finalVariant];
      setVariant(value);
    }

    loadExperiment();
  }, [experimentName, sessionId]);

  return variant;
}

/**
 * Get the current variant name for tracking purposes
 */
export function useExperimentVariant(
  experimentName: keyof ExperimentConfig,
  sessionId?: string
): UpsellTimingVariant {
  const [variantName, setVariantName] = useState<UpsellTimingVariant>('control');

  useEffect(() => {
    if (!sessionId) return;

    async function loadVariant() {
      const edgeVariant = await getVariantFromEdgeConfig(experimentName);

      if (edgeVariant && edgeVariant in EXPERIMENT_DEFAULTS[experimentName]) {
        setVariantName(edgeVariant as UpsellTimingVariant);
      } else {
        const variant = getUserVariant(experimentName, sessionId!);
        setVariantName(variant);
      }
    }

    loadVariant();
  }, [experimentName, sessionId]);

  return variantName;
}

/**
 * Track experiment events
 */
export function trackExperiment(
  eventName: string,
  properties: Record<string, any>
) {
  track(eventName, properties);
}
