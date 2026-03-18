"use client";

import { useState } from "react";
import { parseEmployeeCSV, type EmployeeRow, generateSampleCSV } from "@/lib/csv-parser";
import { TIER_CONFIG, type TierId } from "@/lib/stripe";

interface FormData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  password: string;
}

export default function CorporatePortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    contactName: "",
    contactEmail: "",
    password: "",
  });
  const [selectedTier, setSelectedTier] = useState<TierId>("basic");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const PORTAL_PASSWORD = "corporate2026"; // Simple password protection

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password === PORTAL_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError("Invalid password");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setParseErrors([]);

    const result = await parseEmployeeCSV(file);

    if (result.success) {
      setEmployees(result.data);
    } else {
      setParseErrors(result.errors);
      setEmployees([]);
    }
  };

  const handleDownloadSample = () => {
    const csv = generateSampleCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEditEmployee = (index: number, field: keyof EmployeeRow, value: string) => {
    const updated = [...employees];
    updated[index] = { ...updated[index], [field]: value };
    setEmployees(updated);
  };

  const handleRemoveEmployee = (index: number) => {
    setEmployees(employees.filter((_, i) => i !== index));
  };

  const handleConfirmAndPay = async () => {
    if (!formData.companyName || !formData.contactName || !formData.contactEmail) {
      alert("Please fill in all company information fields");
      return;
    }

    if (employees.length === 0) {
      alert("Please upload a CSV file with employee data");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/corporate/bulk-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          tier: selectedTier,
          employees,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      setOrderSuccess(true);
      setLoading(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Order failed. Please try again.");
      setLoading(false);
    }
  };

  const tierConfig = TIER_CONFIG.find((t) => t.id === selectedTier);
  const totalAmount = employees.length * (tierConfig?.price || 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background-secondary flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🏢</div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Corporate Portal</h1>
            <p className="text-text-secondary">Bulk order portal for corporate gifting</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Access Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-text-primary focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30"
                placeholder="Enter portal password"
              />
              {authError && (
                <p className="text-red-400 text-sm mt-2">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gold text-black font-bold rounded-full hover:bg-gold/90 transition-all"
            >
              Access Portal
            </button>
          </form>

          <p className="text-center text-xs text-text-secondary mt-6">
            Contact us at hello@pawcasso.com for access
          </p>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background-secondary flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-4xl font-bold text-text-primary mb-4">Order Submitted!</h1>
          <p className="text-text-secondary text-lg mb-8">
            Your corporate order for <strong>{employees.length} portraits</strong> has been created successfully.
          </p>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 mb-8 text-left">
            <h2 className="text-xl font-semibold text-text-primary mb-4">What happens next?</h2>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-gold text-xl">📧</span>
                <span>Individual emails have been sent to all employees with photo upload links</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold text-xl">📸</span>
                <span>Employees will upload their pet photos at their convenience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold text-xl">🎨</span>
                <span>Portraits will be generated and delivered within 24 hours of photo upload</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold text-xl">💰</span>
                <span>Invoice for ${totalAmount.toFixed(2)} sent to {formData.contactEmail}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-white/[0.06] border border-white/[0.12] text-text-primary font-semibold rounded-full hover:bg-white/[0.10] transition-all"
          >
            Create Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background-secondary py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🏢</div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Corporate <span className="text-gradient">Gifting Portal</span>
          </h1>
          <p className="text-text-secondary text-lg">
            Bulk order custom pet portraits for your team
          </p>
        </div>

        {/* Company Information */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-text-primary focus:border-gold/60 focus:outline-none"
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Contact Name *
              </label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-text-primary focus:border-gold/60 focus:outline-none"
                placeholder="Jane Smith"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-text-primary focus:border-gold/60 focus:outline-none"
                placeholder="jane@acmecorp.com"
              />
            </div>
          </div>
        </div>

        {/* Package Selection */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">Choose Package</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TIER_CONFIG.filter(t => t.id !== 'bundle').map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`text-left p-6 rounded-xl border transition-all ${
                  selectedTier === tier.id
                    ? "border-gold bg-gold/10 ring-2 ring-gold/40"
                    : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16]"
                }`}
              >
                <h3 className="text-xl font-bold text-text-primary mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-gold mb-3">{tier.priceDisplay}</div>
                <ul className="space-y-2 text-sm text-text-secondary">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-gold">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>

        {/* CSV Upload */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Upload Employee List</h2>
          <p className="text-text-secondary mb-6">
            Upload a CSV file with your employee information. Each employee will receive an individual email with a unique upload link.
          </p>

          <div className="flex gap-3 mb-6">
            <button
              onClick={handleDownloadSample}
              className="px-4 py-2 bg-white/[0.06] border border-white/[0.12] text-text-primary text-sm font-medium rounded-lg hover:bg-white/[0.10] transition-all"
            >
              Download Template CSV
            </button>
          </div>

          <div className="border-2 border-dashed border-white/[0.12] hover:border-gold/40 rounded-xl p-8 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <div className="text-4xl mb-3">📄</div>
              {csvFile ? (
                <p className="text-gold font-medium">{csvFile.name}</p>
              ) : (
                <>
                  <p className="text-text-secondary font-medium">Click to upload CSV</p>
                  <p className="text-white/30 text-sm mt-2">employee_name, employee_email, pet_photo_url (optional)</p>
                </>
              )}
            </label>
          </div>

          {parseErrors.length > 0 && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <h3 className="text-red-400 font-semibold mb-2">CSV Errors:</h3>
              <ul className="list-disc list-inside text-red-400 text-sm space-y-1">
                {parseErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Employee Preview Table */}
        {employees.length > 0 && (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-text-primary mb-6">
              Employee List ({employees.length} total)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">#</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Photo URL</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, idx) => (
                    <tr key={idx} className="border-b border-white/[0.05]">
                      <td className="py-3 px-4 text-text-secondary">{idx + 1}</td>
                      <td className="py-3 px-4">
                        {editingIndex === idx ? (
                          <input
                            type="text"
                            value={emp.name}
                            onChange={(e) => handleEditEmployee(idx, "name", e.target.value)}
                            className="bg-white/[0.06] border border-white/[0.08] rounded px-2 py-1 text-sm text-text-primary w-full"
                          />
                        ) : (
                          <span className="text-text-primary">{emp.name}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingIndex === idx ? (
                          <input
                            type="email"
                            value={emp.email}
                            onChange={(e) => handleEditEmployee(idx, "email", e.target.value)}
                            className="bg-white/[0.06] border border-white/[0.08] rounded px-2 py-1 text-sm text-text-primary w-full"
                          />
                        ) : (
                          <span className="text-text-primary">{emp.email}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-text-secondary text-sm">
                          {emp.petPhotoUrl ? "✓ Provided" : "Will upload later"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {editingIndex === idx ? (
                            <button
                              onClick={() => setEditingIndex(null)}
                              className="text-gold text-sm hover:underline"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditingIndex(idx)}
                              className="text-text-secondary text-sm hover:text-gold"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveEmployee(idx)}
                            className="text-red-400 text-sm hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Summary & Confirm */}
        {employees.length > 0 && (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Order Summary</h2>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-text-secondary">
                <span>Package: {tierConfig?.name}</span>
                <span>{tierConfig?.priceDisplay} per portrait</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Total Employees:</span>
                <span>{employees.length}</span>
              </div>
              <div className="border-t border-white/[0.08] pt-3 flex justify-between text-xl font-bold text-text-primary">
                <span>Total Amount:</span>
                <span className="text-gold">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmAndPay}
              disabled={loading || employees.length === 0}
              className="w-full py-4 bg-gold text-black font-bold text-lg rounded-full hover:bg-gold/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? "Processing..." : `Confirm & Pay $${totalAmount.toFixed(2)}`}
            </button>

            <p className="text-center text-xs text-text-secondary mt-4">
              An invoice will be sent to {formData.contactEmail || "your email"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
