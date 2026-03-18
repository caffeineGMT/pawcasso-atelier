"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface EmployeeData {
  employeeName: string;
  employeeEmail: string;
  companyName: string;
  status: string;
}

export default function EmployeeUploadPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Fetch employee data on mount
  useEffect(() => {
    async function fetchEmployeeData() {
      try {
        const res = await fetch(`/api/corporate/upload/${token}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Invalid upload link");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setEmployeeData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load upload page");
        setLoading(false);
      }
    }

    if (token) {
      fetchEmployeeData();
    }
  }, [token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size exceeds 10MB limit. Please choose a smaller image.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a photo to upload");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload photo to Vercel Blob
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Photo upload failed");
      }

      const { url: photoUrl } = await uploadRes.json();

      // Update employee record with photo URL
      const updateRes = await fetch(`/api/corporate/upload/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petPhotoUrl: photoUrl }),
      });

      if (!updateRes.ok) {
        const data = await updateRes.json();
        throw new Error(data.error || "Failed to update record");
      }

      setUploadSuccess(true);
      setUploading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background-secondary">
        <div className="text-text-primary text-lg">Loading...</div>
      </div>
    );
  }

  if (error && !employeeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background-secondary px-6">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-text-primary mb-4">Invalid Link</h1>
          <p className="text-text-secondary mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gold text-black font-semibold rounded-full hover:bg-gold/90 transition-all"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  if (uploadSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background-secondary px-6">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-text-primary mb-4">Upload Successful!</h1>
          <p className="text-text-secondary mb-6">
            Thank you for uploading your pet photo! We'll transform it into a stunning portrait and deliver it to your email within 24 hours.
          </p>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <p className="text-sm text-text-secondary">
              <strong className="text-text-primary">What's next?</strong>
              <br />
              Our AI artists are already at work creating your custom portrait. You'll receive an email at <span className="text-gold">{employeeData?.employeeEmail}</span> as soon as it's ready.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background-secondary py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🎁</div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            You've Got a <span className="text-gradient">Gift</span>!
          </h1>
          <p className="text-text-secondary text-lg">
            {employeeData?.companyName} has gifted you a custom pet portrait
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Hi {employeeData?.employeeName}! 👋
          </h2>
          <p className="text-text-secondary mb-6">
            Upload a photo of your furry friend and we'll transform it into a stunning AI-generated portrait delivered straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">
                Upload Your Pet Photo
              </label>
              <div className="border-2 border-dashed border-white/[0.12] hover:border-gold/40 transition-all rounded-2xl p-10 text-center cursor-pointer relative group">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <svg className="w-12 h-12 mx-auto text-white/20 group-hover:text-gold/60 transition-colors mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {selectedFile ? (
                  <p className="text-gold text-lg font-medium">{selectedFile.name}</p>
                ) : (
                  <>
                    <p className="text-text-secondary text-lg font-medium">Click or drag to upload</p>
                    <p className="text-white/20 text-sm mt-2">JPG, PNG, or WebP — max 10MB</p>
                  </>
                )}
              </div>

              {previewUrl && (
                <div className="mt-6 flex justify-center">
                  <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-gold/40 shadow-lg">
                    <Image
                      src={previewUrl}
                      alt="Pet photo preview"
                      fill
                      className="object-cover"
                      sizes="256px"
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="w-full py-4 bg-gold text-black font-bold text-lg rounded-full hover:bg-gold/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {uploading ? "Uploading..." : "Upload & Generate Portrait"}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.08]">
            <div className="text-3xl mb-2">📸</div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">Upload Photo</h3>
            <p className="text-xs text-text-secondary">Clear photo of your pet</p>
          </div>
          <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.08]">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">AI Generation</h3>
            <p className="text-xs text-text-secondary">We create your portrait</p>
          </div>
          <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.08]">
            <div className="text-3xl mb-2">📧</div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">Delivered</h3>
            <p className="text-xs text-text-secondary">Sent to your email in 24h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
