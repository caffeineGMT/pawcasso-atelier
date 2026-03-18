"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { artStyleOptions } from "@/lib/data";

const stylePreviewMap: Record<string, { image: string; title: string }> = {
  renaissance: { image: "/gallery/cat_vermeer.png", title: "Cat with a Pearl Earring" },
  baroque: { image: "/gallery/lion_portrait.png", title: "Sovereign Light" },
  impressionist: { image: "/gallery/starry_night_persian_cat.png", title: "Starry Night Whiskers" },
  ghibli: { image: "/gallery/golden_retriever_ghibli.png", title: "Moonlit Garden" },
  watercolor: { image: "/gallery/hedgehog_bookshop_tree_trunk.png", title: "The Little Bookshop" },
  "art-nouveau": { image: "/gallery/owl_art_nouveau.png", title: "The Keeper of Pages" },
  "ukiyo-e": { image: "/gallery/pisces_zodiac_ukiyoe_portrait.png", title: "Pisces Rising" },
  cyberpunk: { image: "/gallery/the_catrix_poster.png", title: "The Catrix" },
  "pixar-3d": { image: "/gallery/red_panda_pixar_chef.png", title: "Chef\u2019s Kiss" },
  "needle-felt": { image: "/gallery/corgi_needle_felt.png", title: "Woolly Wanderer" },
  hyperrealism: { image: "/gallery/penguin_gala.png", title: "Black Tie Affair" },
  "art-deco": { image: "/gallery/the_great_catsby_poster.png", title: "The Great Catsby" },
};

export default function OrderPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [style, setStyle] = useState("");
  const [petName, setPetName] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Clear previous errors
    setUploadError(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setUploadError("File size exceeds 10MB limit. Please choose a smaller image.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Invalid file type. Please upload a JPEG, PNG, WebP, or HEIC image.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Set the file and generate preview
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadError(null);

    try {
      // Upload the photo first if one is selected
      let petPhotoUrl = null;
      if (selectedFile) {
        setUploadProgress(50);
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.error || "Photo upload failed");
        }

        const uploadData = await uploadRes.json();
        petPhotoUrl = uploadData.url;
        setUploadProgress(100);
      }

      // Create checkout session with photo URL
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, style, petName, notes, petPhotoUrl }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again or DM us on Instagram.");
        setLoading(false);
        setUploadProgress(0);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      setUploadError(errorMessage);
      alert(`${errorMessage}. Please try again or DM us on Instagram.`);
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <section className="py-24 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Custom AI Pet Portrait",
            image: "https://pawcasso-atelier.vercel.app/gallery/cat_vermeer.png",
            description: "Transform your pet into stunning AI-generated artwork. Choose from 17 artistic styles including Renaissance, Pixar 3D, Needle Felt, and more. Portrait delivered within 24 hours.",
            brand: {
              "@type": "Brand",
              name: "Pawcasso Atelier"
            },
            offers: {
              "@type": "Offer",
              url: "https://pawcasso-atelier.vercel.app/order",
              priceCurrency: "USD",
              price: "9.00",
              availability: "https://schema.org/InStock"
            }
          })
        }}
      />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
            Commission a <span className="text-gradient">Portrait</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-md mx-auto leading-relaxed">
            Upload a photo. Pick a style. Get a masterpiece in 24 hours.
          </p>
          <div className="mt-6 inline-flex items-baseline gap-1">
            <span className="text-4xl font-semibold text-text-primary">$9</span>
            <span className="text-text-secondary text-sm">per portrait</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
                placeholder="jane@example.com"
              />
            </div>
          </div>

          {/* Pet Name */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2">
              Pet&apos;s Name
            </label>
            <input
              type="text"
              required
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
              placeholder="Sir Woofington III"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2">
              Pet Photo
            </label>
            <div className="border border-dashed border-white/[0.12] hover:border-gold/40 transition-all rounded-2xl p-10 text-center cursor-pointer relative group">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic"
                required
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <svg className="w-10 h-10 mx-auto text-white/20 group-hover:text-gold/60 transition-colors mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {selectedFile ? (
                <p className="text-gold text-sm font-medium">{selectedFile.name}</p>
              ) : (
                <>
                  <p className="text-text-secondary text-sm">Click or drag to upload</p>
                  <p className="text-white/20 text-xs mt-1">JPG, PNG, WebP, or HEIC — max 10MB</p>
                </>
              )}
            </div>
            {previewUrl && (
              <div className="mt-4 flex justify-center">
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-white/[0.08]">
                  <Image
                    src={previewUrl}
                    alt="Pet photo preview"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              </div>
            )}
            {uploadError && (
              <p className="text-red-400 text-sm mt-2">{uploadError}</p>
            )}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gold h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-text-secondary text-center mt-2">Uploading photo...</p>
              </div>
            )}
          </div>

          {/* Style Selection */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-4">
              Art Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {artStyleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStyle(opt.value)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    style === opt.value
                      ? "border-gold/60 bg-gold/10 ring-1 ring-gold/20"
                      : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16] hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="text-sm font-medium text-text-primary">{opt.label}</div>
                  <div className="text-[11px] text-text-secondary mt-1 leading-snug">{opt.description}</div>
                </button>
              ))}
            </div>

            {/* Style Preview */}
            {style && stylePreviewMap[style] && (
              <div className="mt-6 rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.08]">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={stylePreviewMap[style].image}
                    alt={stylePreviewMap[style].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 640px"
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-text-secondary">
                    Style preview: <span className="text-text-primary font-medium">{stylePreviewMap[style].title}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2">
              Special Requests <span className="normal-case text-white/20">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all resize-none placeholder:text-white/20"
              placeholder="Any specific requests? E.g., include a crown, specific background..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !style || (uploadProgress > 0 && uploadProgress < 100)}
            className="w-full py-4 bg-white text-black font-medium tracking-wide text-sm rounded-full hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {uploadProgress > 0 && uploadProgress < 100
              ? "Uploading photo..."
              : loading
              ? "Redirecting to checkout..."
              : "Pay $9 — Get Your Portrait"}
          </button>

          <p className="text-center text-white/30 text-xs">
            Secure payment via Stripe. Portrait delivered within 24 hours.
          </p>
        </form>
      </div>
    </section>
  );
}
