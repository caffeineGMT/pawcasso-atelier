/**
 * Props for CustomerInfoSection component
 */
export interface CustomerInfoSectionProps {
  /** Customer name */
  name: string;
  /** Customer email */
  email: string;
  /** Pet name */
  petName: string;
  /** Additional notes */
  notes: string;
  /** Name change handler */
  onNameChange: (name: string) => void;
  /** Email change handler */
  onEmailChange: (email: string) => void;
  /** Pet name change handler */
  onPetNameChange: (petName: string) => void;
  /** Notes change handler */
  onNotesChange: (notes: string) => void;
  /** Validation error message */
  error?: string;
  /** Field tracking callback for analytics */
  onFieldInteraction?: (field: string) => void;
}

/**
 * Customer information form section
 *
 * Collects customer and pet details for the order
 */
export default function CustomerInfoSection({
  name,
  email,
  petName,
  notes,
  onNameChange,
  onEmailChange,
  onPetNameChange,
  onNotesChange,
  error,
  onFieldInteraction,
}: CustomerInfoSectionProps) {
  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <div>
        <label htmlFor="customer-name" className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
          Your Name
        </label>
        <input
          id="customer-name"
          type="text"
          value={name}
          onChange={(e) => {
            onNameChange(e.target.value);
            onFieldInteraction?.('name');
          }}
          placeholder="Enter your full name"
          className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-5 py-4 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
          required
        />
      </div>

      <div>
        <label htmlFor="customer-email" className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
          Email Address
        </label>
        <input
          id="customer-email"
          type="email"
          value={email}
          onChange={(e) => {
            onEmailChange(e.target.value);
            onFieldInteraction?.('email');
          }}
          placeholder="your@email.com"
          className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-5 py-4 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
          required
        />
      </div>

      {/* Pet Info */}
      <div>
        <label htmlFor="pet-name" className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
          Pet's Name
        </label>
        <input
          id="pet-name"
          type="text"
          value={petName}
          onChange={(e) => {
            onPetNameChange(e.target.value);
            onFieldInteraction?.('petName');
          }}
          placeholder="e.g., Whiskers, Max, Luna"
          className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-5 py-4 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
          required
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
          Special Requests (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => {
            onNotesChange(e.target.value);
            onFieldInteraction?.('notes');
          }}
          placeholder="Any special requests or details about your pet? (e.g., 'Please emphasize her blue eyes')"
          rows={3}
          className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-5 py-4 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20 resize-none"
        />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-red-400 text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
