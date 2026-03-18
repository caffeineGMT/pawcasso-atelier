"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { artStyleOptions } from "@/lib/data";

export default function FreePortraitPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [redditUsername, setRedditUsername] = useState("");
  const [style, setStyle] = useState("");
  const [petName, setPetName] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("File size exceeds 10MB limit. Please choose a smaller image.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

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

      // Submit the free portrait request
      const res = await fetch("/api/reddit/free-portrait", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          redditUsername,
          style,
          petName,
          notes,
          petPhotoUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        setUploadProgress(0);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      setUploadError(errorMessage);
      alert(`${errorMessage}. Please try again.`);
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (submitted) {
    return (
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Request Received!
            </h1>
            <p className="text-text-secondary text-lg max-w-md mx-auto">
              Thanks for being an early supporter! I'll create your portrait and email it to you within 48 hours.
            </p>
          </div>
          <div className="rounded-2xl bg-bg-card p-8 text-left">
            <h3 className="text-lg font-medium mb-4">What happens next:</h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">1.</span>
                <span>I'll generate your portrait in the style you selected</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">2.</span>
                <span>You'll receive it via email within 48 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">3.</span>
                <span>I'd love your feedback! Reply to the email or tag me on Reddit (u/{redditUsername})</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
            <span className="text-gold text-sm font-medium">Limited Time Offer</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
            Get a <span className="text-gradient">Free Portrait</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-md mx-auto leading-relaxed">
            I'm giving away free portraits to early supporters in exchange for feedback. Help me make this tool better!
          </p>
        </div>

        {/* Info Box */}
        <div className="rounded-2xl bg-bg-card p-6 mb-12 border border-white/[0.06]">
          <h3 className="text-lg font-medium mb-3">What you get:</h3>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li className="flex items-center gap-3">
              <span className="text-gold">✓</span>
              <span>One free custom pet portrait (same quality as paid version)</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-gold">✓</span>
              <span>High-resolution 4000×5000px digital file</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-gold">✓</span>
              <span>Any of the 17 available art styles</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-gold">✓</span>
              <span>Delivered within 48 hours</span>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <p className="text-text-secondary text-sm">
              <span className="text-text-primary font-medium">What I ask in return:</span> Just honest feedback! Was the quality good? Would you pay $9 for this? What could be better? Reply to the email or tag me on Reddit.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[44px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[44px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
                placeholder="jane@example.com"
              />
            </div>
          </div>

          {/* Reddit Username */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
              Reddit Username
            </label>
            <input
              type="text"
              required
              value={redditUsername}
              onChange={(e) => setRedditUsername(e.target.value)}
              className="w-full min-h-[44px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
              placeholder="u/your_username"
            />
          </div>

          {/* Pet Name */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
              Pet&apos;s Name
            </label>
            <input
              type="text"
              required
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full min-h-[44px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20"
              placeholder="Sir Woofington III"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
              Pet Photo
            </label>
            <div className="border border-dashed border-white/[0.12] hover:border-gold/40 transition-all rounded-2xl p-8 sm:p-10 text-center cursor-pointer relative group min-h-[120px] flex flex-col items-center justify-center">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <svg className="w-10 h-10 mx-auto text-white/20 group-hover:text-gold/60 transition-colors mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {selectedFile ? (
                <p className="text-gold text-base font-medium">{selectedFile.name}</p>
              ) : (
                <>
                  <p className="text-text-secondary text-base">Click or drag to upload</p>
                  <p className="text-white/20 text-xs mt-1">JPG, PNG, or WebP — max 10MB</p>
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
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
              Art Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {artStyleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStyle(opt.value)}
                  className={`text-left p-4 rounded-xl border transition-all min-h-[64px] ${
                    style === opt.value
                      ? "border-gold/60 bg-gold/10 ring-1 ring-gold/20"
                      : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16] hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="text-base font-medium text-text-primary">{opt.label}</div>
                  <div className="text-xs text-text-secondary mt-1 leading-snug">{opt.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-text-secondary mb-2 font-medium">
              Special Requests <span className="normal-case text-white/20">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full min-h-[100px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-base text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all resize-none placeholder:text-white/20"
              placeholder="Any specific requests? Background preferences? Additional details?"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !style || (uploadProgress > 0 && uploadProgress < 100)}
            className="w-full min-h-[48px] py-4 bg-gold text-black font-medium tracking-wide text-base rounded-full hover:bg-gold-light transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {uploadProgress > 0 && uploadProgress < 100
              ? "Uploading photo..."
              : loading
              ? "Submitting request..."
              : "Request Free Portrait"}
          </button>

          <p className="text-center text-white/30 text-xs">
            Your portrait will be delivered to your email within 48 hours. No payment required.
          </p>
        </form>
      </div>
    </section>
  );
}
