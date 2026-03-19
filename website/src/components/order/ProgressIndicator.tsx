/**
 * Progress Indicator Component for Multi-Step Checkout
 *
 * Displays current step in the checkout wizard with visual progress
 * Mobile-optimized with touch-friendly sizing
 */

export interface ProgressIndicatorProps {
  /** Current step number (1-3) */
  currentStep: number;
  /** Total number of steps */
  totalSteps?: number;
  /** Step labels */
  stepLabels?: string[];
  /** Callback when user clicks a completed step */
  onStepClick?: (step: number) => void;
}

const DEFAULT_LABELS = ['Upload Photo', 'Choose Style', 'Checkout'];

export default function ProgressIndicator({
  currentStep,
  totalSteps = 3,
  stepLabels = DEFAULT_LABELS,
  onStepClick,
}: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      {/* Desktop: Horizontal stepper */}
      <div className="hidden sm:flex items-center justify-between max-w-md mx-auto">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <button
              type="button"
              onClick={() => {
                // Only allow clicking previous steps
                if (step < currentStep && onStepClick) {
                  onStepClick(step);
                }
              }}
              disabled={step >= currentStep}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                currentStep >= step
                  ? 'bg-gold text-black shadow-lg shadow-gold/40'
                  : 'bg-white/10 text-white/40'
              } ${
                step < currentStep && onStepClick
                  ? 'cursor-pointer hover:bg-gold/80'
                  : 'cursor-default'
              }`}
              aria-label={`Step ${step}: ${stepLabels[step - 1]}`}
              aria-current={currentStep === step ? 'step' : undefined}
            >
              {step}
            </button>
            {step < totalSteps && (
              <div
                className={`w-16 h-1 transition-all ${
                  currentStep > step ? 'bg-gold' : 'bg-white/10'
                }`}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: Compact stepper */}
      <div className="sm:hidden flex items-center justify-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`h-2 rounded-full transition-all ${
              currentStep >= step
                ? 'bg-gold w-12'
                : 'bg-white/10 w-8'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Step label - Always visible */}
      <div className="text-center mt-4">
        <p className="text-sm text-text-secondary">
          Step {currentStep} of {totalSteps}
        </p>
        <p className="text-base sm:text-lg font-semibold text-text-primary mt-1">
          {stepLabels[currentStep - 1]}
        </p>
      </div>

      {/* Accessibility: Screen reader progress */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}
      </div>
    </div>
  );
}
