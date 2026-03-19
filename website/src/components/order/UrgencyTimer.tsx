/**
 * Props for UrgencyTimer component
 */
export interface UrgencyTimerProps {
  /** Formatted time string (HH:MM:SS) */
  formattedTime: string;
  /** Custom message to display */
  message?: string;
}

/**
 * Urgency timer component displaying countdown with red styling
 *
 * Used to create scarcity and encourage immediate action
 */
export default function UrgencyTimer({
  formattedTime,
  message = "Special pricing ends in:",
}: UrgencyTimerProps) {
  return (
    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
        <div className="text-center sm:text-left">
          <span className="text-red-400 font-medium text-sm">{message} </span>
          <span className="text-red-300 font-mono font-bold text-lg ml-1">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
}
