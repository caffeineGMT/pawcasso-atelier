"use client";

import { useState, useEffect, useCallback } from "react";

interface LoyaltyStatus {
  tier: string;
  tierLabel: string;
  totalOrders: number;
  totalSpent: number;
  currentPoints: number;
  lifetimePoints: number;
  nextTier: string | null;
  ordersToNextTier: number;
  spentToNextTier: number;
  tierBenefits: {
    pointsMultiplier: number;
    discountPercent: number;
  };
  repeatDiscountCode: string | null;
  repeatDiscountUsed: boolean;
  rewards: {
    id: string;
    type: string;
    description: string;
    discountCode: string | null;
    discountPercent: number | null;
    used: boolean;
    expiresAt: string | null;
  }[];
}

interface PetProfile {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  birthday: string | null;
  photoUrl: string | null;
  portraitCount: number;
}

const TIER_COLORS: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  bronze: { bg: "bg-amber-900/20", border: "border-amber-700/40", text: "text-amber-500", icon: "🥉" },
  silver: { bg: "bg-gray-400/10", border: "border-gray-400/40", text: "text-gray-300", icon: "🥈" },
  gold: { bg: "bg-yellow-500/10", border: "border-yellow-500/40", text: "text-yellow-400", icon: "🥇" },
  platinum: { bg: "bg-purple-300/10", border: "border-purple-300/40", text: "text-purple-300", icon: "💎" },
};

export function LoyaltyDashboard() {
  const [status, setStatus] = useState<LoyaltyStatus | null>(null);
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPet, setShowAddPet] = useState(false);
  const [petForm, setPetForm] = useState({ name: "", species: "dog", breed: "", birthday: "" });
  const [saving, setSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [loyaltyRes, petsRes] = await Promise.all([
        fetch("/api/loyalty"),
        fetch("/api/loyalty/pets"),
      ]);

      if (loyaltyRes.ok) {
        setStatus(await loyaltyRes.json());
      }
      if (petsRes.ok) {
        const data = await petsRes.json();
        setPets(data.pets || []);
      }
    } catch (err) {
      console.error("Failed to fetch loyalty data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleAddPet(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/loyalty/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: petForm.name,
          species: petForm.species,
          breed: petForm.breed || null,
          birthday: petForm.birthday || null,
        }),
      });
      if (res.ok) {
        setPetForm({ name: "", species: "dog", breed: "", birthday: "" });
        setShowAddPet(false);
        await fetchData();
      }
    } catch (err) {
      console.error("Failed to save pet:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePet(id: string) {
    try {
      await fetch("/api/loyalty/pets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await fetchData();
    } catch (err) {
      console.error("Failed to delete pet:", err);
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-white/[0.04] animate-pulse" />
        ))}
      </div>
    );
  }

  if (!status) return null;

  const tierStyle = TIER_COLORS[status.tier] || TIER_COLORS.bronze;
  const progressPercent = status.nextTier
    ? Math.min(100, ((status.totalOrders) / (status.totalOrders + status.ordersToNextTier)) * 100)
    : 100;

  const activeRewards = status.rewards.filter((r) => !r.used && (!r.expiresAt || new Date(r.expiresAt) > new Date()));

  return (
    <div className="space-y-8">
      {/* Tier Badge & Progress */}
      <div className={`rounded-2xl ${tierStyle.bg} border ${tierStyle.border} p-6 md:p-8`}>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-5xl">{tierStyle.icon}</span>
          <div>
            <div className={`text-2xl font-bold ${tierStyle.text} uppercase tracking-wider`}>
              {status.tierLabel}
            </div>
            <div className="text-text-secondary text-sm">
              {status.totalOrders} portrait{status.totalOrders !== 1 ? "s" : ""} ordered
              {" | "}${status.totalSpent.toFixed(0)} total spent
            </div>
          </div>
        </div>

        {/* Progress to next tier */}
        {status.nextTier && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-secondary">Progress to {status.nextTier.charAt(0).toUpperCase() + status.nextTier.slice(1)}</span>
              <span className={tierStyle.text}>
                {status.ordersToNextTier} more order{status.ordersToNextTier !== 1 ? "s" : ""} needed
              </span>
            </div>
            <div className="w-full bg-white/[0.08] rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  status.tier === "bronze" ? "bg-amber-600" :
                  status.tier === "silver" ? "bg-gray-400" :
                  status.tier === "gold" ? "bg-yellow-500" : "bg-purple-400"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {!status.nextTier && (
          <div className={`text-sm ${tierStyle.text}`}>
            You&apos;ve reached our highest tier! Maximum benefits on every order.
          </div>
        )}

        {/* Tier Benefits */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="rounded-lg bg-white/[0.04] p-3">
            <div className="text-xs text-text-secondary uppercase tracking-wider">Points Multiplier</div>
            <div className="text-lg font-bold text-text-primary">{status.tierBenefits.pointsMultiplier}x</div>
          </div>
          <div className="rounded-lg bg-white/[0.04] p-3">
            <div className="text-xs text-text-secondary uppercase tracking-wider">Tier Discount</div>
            <div className="text-lg font-bold text-text-primary">
              {status.tierBenefits.discountPercent > 0 ? `${status.tierBenefits.discountPercent}%` : "---"}
            </div>
          </div>
          <div className="rounded-lg bg-white/[0.04] p-3">
            <div className="text-xs text-text-secondary uppercase tracking-wider">Current Points</div>
            <div className="text-lg font-bold text-text-primary">{status.currentPoints}</div>
          </div>
          <div className="rounded-lg bg-white/[0.04] p-3">
            <div className="text-xs text-text-secondary uppercase tracking-wider">Lifetime Points</div>
            <div className="text-lg font-bold text-text-primary">{status.lifetimePoints}</div>
          </div>
        </div>
      </div>

      {/* Active Rewards & Discounts */}
      {(activeRewards.length > 0 || (status.repeatDiscountCode && !status.repeatDiscountUsed)) && (
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-4">Your Rewards</h3>
          <div className="space-y-3">
            {status.repeatDiscountCode && !status.repeatDiscountUsed && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-primary">20% Off Your Next Portrait</div>
                  <div className="text-sm text-text-secondary">
                    Thanks for being a Pawcasso customer! Valid for 90 days.
                  </div>
                </div>
                <button
                  onClick={() => copyCode(status.repeatDiscountCode!)}
                  className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-mono hover:bg-primary/30 transition-colors whitespace-nowrap"
                >
                  {copiedCode === status.repeatDiscountCode ? "Copied!" : status.repeatDiscountCode}
                </button>
              </div>
            )}

            {activeRewards.map((reward) => (
              <div
                key={reward.id}
                className="rounded-xl border border-white/[0.08] bg-bg-card p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-text-primary">{reward.description}</div>
                  <div className="text-sm text-text-secondary">
                    {reward.discountPercent && `${reward.discountPercent}% off`}
                    {reward.expiresAt && ` | Expires ${new Date(reward.expiresAt).toLocaleDateString()}`}
                  </div>
                </div>
                {reward.discountCode && (
                  <button
                    onClick={() => copyCode(reward.discountCode!)}
                    className="px-4 py-2 bg-white/[0.06] text-primary rounded-lg text-sm font-mono hover:bg-white/[0.1] transition-colors whitespace-nowrap"
                  >
                    {copiedCode === reward.discountCode ? "Copied!" : reward.discountCode}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pet Profiles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-text-primary">Your Pets</h3>
          <button
            onClick={() => setShowAddPet(!showAddPet)}
            className="px-4 py-2 bg-primary text-black rounded-full text-sm font-semibold hover:bg-primary-light transition-colors"
          >
            {showAddPet ? "Cancel" : "+ Add Pet"}
          </button>
        </div>

        {showAddPet && (
          <form onSubmit={handleAddPet} className="rounded-xl border border-white/[0.08] bg-bg-card p-6 mb-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">Pet Name *</label>
                <input
                  type="text"
                  required
                  value={petForm.name}
                  onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.1] text-text-primary focus:outline-none focus:border-primary"
                  placeholder="e.g., Alfie"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Species</label>
                <select
                  value={petForm.species}
                  onChange={(e) => setPetForm({ ...petForm, species: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.1] text-text-primary focus:outline-none focus:border-primary"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="horse">Horse</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Breed (optional)</label>
                <input
                  type="text"
                  value={petForm.breed}
                  onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.1] text-text-primary focus:outline-none focus:border-primary"
                  placeholder="e.g., Border Collie"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Birthday (for birthday portrait reminders)</label>
                <input
                  type="date"
                  value={petForm.birthday}
                  onChange={(e) => setPetForm({ ...petForm, birthday: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.1] text-text-primary focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving || !petForm.name}
              className="px-6 py-2 bg-primary text-black rounded-full font-semibold hover:bg-primary-light transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Pet"}
            </button>
          </form>
        )}

        {pets.length === 0 && !showAddPet ? (
          <div className="rounded-xl border border-white/[0.08] bg-bg-card p-8 text-center">
            <p className="text-text-secondary mb-2">No pets added yet</p>
            <p className="text-sm text-text-secondary">
              Add your pets to get birthday portrait reminders and track their portrait collection!
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="rounded-xl border border-white/[0.08] bg-bg-card p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {pet.species === "cat" ? "🐱" : pet.species === "bird" ? "🐦" : pet.species === "rabbit" ? "🐰" : pet.species === "horse" ? "🐴" : "🐶"}
                  </span>
                  <div>
                    <div className="font-semibold text-text-primary">{pet.name}</div>
                    <div className="text-sm text-text-secondary">
                      {pet.breed && `${pet.breed} | `}
                      {pet.portraitCount} portrait{pet.portraitCount !== 1 ? "s" : ""}
                      {pet.birthday && ` | Birthday: ${new Date(pet.birthday).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeletePet(pet.id)}
                  className="text-text-secondary hover:text-red-400 transition-colors text-sm"
                  aria-label={`Remove ${pet.name}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="rounded-xl border border-white/[0.08] bg-bg-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">How the Loyalty Program Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div>
              <div className="font-semibold text-amber-500">Bronze (Start)</div>
              <div className="text-text-secondary">1x points, 20% off 2nd portrait</div>
            </div>
            <div>
              <div className="font-semibold text-gray-300">Silver (2+ orders)</div>
              <div className="text-text-secondary">1.5x points, 10% off every order</div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="font-semibold text-yellow-400">Gold (4+ orders)</div>
              <div className="text-text-secondary">2x points, 15% off every order</div>
            </div>
            <div>
              <div className="font-semibold text-purple-300">Platinum (7+ orders)</div>
              <div className="text-text-secondary">3x points, 20% off every order</div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/[0.06] text-sm text-text-secondary">
          Add your pet&apos;s birthday above to receive a special 25% off birthday portrait discount each year!
        </div>
      </div>
    </div>
  );
}
