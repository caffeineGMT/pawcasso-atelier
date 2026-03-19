import Image from "next/image";
import { artStyleOptions } from "@/lib/data";
import { type StylePreview } from "@/types/order";

/**
 * Props for StyleSelector component
 */
export interface StyleSelectorProps {
  /** Currently selected style */
  selectedStyle: string;
  /** Callback when style is selected */
  onSelectStyle: (styleValue: string) => void;
  /** Style preview mapping */
  stylePreviewMap: Record<string, StylePreview>;
  /** Validation error message */
  error?: string;
  /** Maximum number of styles to display */
  maxStyles?: number;
}

/**
 * Art style selector component with preview
 *
 * Displays grid of art style options with preview of selected style
 */
export default function StyleSelector({
  selectedStyle,
  onSelectStyle,
  stylePreviewMap,
  error,
  maxStyles = 12,
}: StyleSelectorProps) {
  return (
    <div>
      <label className="block text-xs tracking-wider uppercase text-text-secondary mb-4 font-medium text-center">
        Art Style
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {artStyleOptions.slice(0, maxStyles).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelectStyle(opt.value)}
            className={`text-left p-5 rounded-xl border transition-all min-h-[88px] touch-manipulation ${
              selectedStyle === opt.value
                ? "border-gold/60 bg-gold/10 ring-1 ring-gold/20"
                : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16] hover:bg-white/[0.06]"
            }`}
            aria-pressed={selectedStyle === opt.value}
            aria-label={`${opt.label} art style: ${opt.description}`}
          >
            <div className="text-base font-semibold text-text-primary">{opt.label}</div>
            <div className="text-xs text-text-secondary mt-1 leading-snug">{opt.description}</div>
          </button>
        ))}
      </div>

      {/* Style Preview */}
      {selectedStyle && stylePreviewMap[selectedStyle] && (
        <div className="mt-6 rounded-2xl overflow-hidden bg-white/[0.03] border-2 border-gold/40 shadow-lg shadow-gold/20">
          <div className="aspect-[4/3] relative">
            <Image
              src={stylePreviewMap[selectedStyle].image}
              alt={stylePreviewMap[selectedStyle].title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 640px"
            />
          </div>
          <div className="px-4 py-3 bg-gold/10">
            <p className="text-sm text-text-primary font-medium">
              Preview: {stylePreviewMap[selectedStyle].title}
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm mt-3 text-center font-medium">{error}</p>
      )}
    </div>
  );
}
