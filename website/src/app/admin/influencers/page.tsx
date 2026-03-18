"use client";

import { useState, useEffect } from "react";

interface Influencer {
  id: string;
  name: string;
  handle: string;
  platform: string;
  followerCount: number;
  status: string;
  discountCode: string;
  affiliateLink: string;
  estimatedReach: number;
  email?: string;
  notes?: string;
  profileUrl?: string;
  portraitSent: boolean;
  conversions: Array<{
    revenue: number;
    commission: number;
  }>;
  outreachMessages: Array<{
    sentAt: string;
  }>;
}

interface Stats {
  totalInfluencers: number;
  contacted: number;
  responded: number;
  agreed: number;
  posted: number;
  totalRevenue: number;
  totalCommission: number;
}

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);

  const fetchInfluencers = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterPlatform !== "all") params.append("platform", filterPlatform);

      const response = await fetch(`/api/influencers?${params.toString()}`);
      const data = await response.json();
      setInfluencers(data.influencers);
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching influencers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, [filterStatus, filterPlatform]);

  const handleAddInfluencer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const influencer = {
      name: formData.get("name") as string,
      handle: formData.get("handle") as string,
      platform: formData.get("platform") as string,
      followerCount: parseInt(formData.get("followerCount") as string),
      email: formData.get("email") as string,
      notes: formData.get("notes") as string,
      profileUrl: formData.get("profileUrl") as string,
    };

    try {
      const response = await fetch("/api/influencers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(influencer),
      });

      if (response.ok) {
        setShowAddForm(false);
        form.reset();
        fetchInfluencers();
      }
    } catch (error) {
      console.error("Error adding influencer:", error);
    }
  };

  const handleBulkImport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const csvText = formData.get("csv") as string;

    // Parse CSV (simple implementation - assumes format: name,handle,platform,followerCount,email)
    const lines = csvText.trim().split("\n");
    const influencers = lines.slice(1).map((line) => {
      const [name, handle, platform, followerCount, email, profileUrl] = line.split(",");
      return {
        name: name?.trim(),
        handle: handle?.trim(),
        platform: platform?.trim(),
        followerCount: parseInt(followerCount?.trim()),
        email: email?.trim(),
        profileUrl: profileUrl?.trim(),
      };
    });

    try {
      const response = await fetch("/api/influencers/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ influencers }),
      });

      const result = await response.json();
      alert(`Imported ${result.created} influencers. Errors: ${result.errors.length}`);
      setShowBulkImport(false);
      form.reset();
      fetchInfluencers();
    } catch (error) {
      console.error("Error bulk importing:", error);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/influencers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchInfluencers();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSendMessage = async (id: string, message: string) => {
    try {
      const response = await fetch(`/api/influencers/${id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        fetchInfluencers();
        alert("Message logged successfully!");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getDMTemplate = (influencer: Influencer) => {
    const petName = influencer.name.split("'s")[0] || influencer.name;
    return `Hi ${influencer.handle}! Love ${petName}'s content 🐾 We make AI pet portraits and would love to send you a free one + feature you in our gallery. Interested?\n\nYou'll get:\n✨ Free portrait in 3 styles\n💰 20% discount code for your audience (${influencer.discountCode})\n🎁 15% commission on all sales\n\nYour affiliate link: ${influencer.affiliateLink}`;
  };

  const handleExportCSV = () => {
    // Prepare CSV data
    const csvHeaders = [
      'Name',
      'Handle',
      'Platform',
      'Followers',
      'Status',
      'Discount Code',
      'Sales Count',
      'Total Revenue',
      'Commission Owed',
      'Email',
      'Profile URL',
    ];

    const csvRows = influencers.map(influencer => {
      const revenue = influencer.conversions.reduce((sum, conv) => sum + conv.revenue, 0);
      const commission = influencer.conversions.reduce((sum, conv) => sum + conv.commission, 0);
      const salesCount = influencer.conversions.length;

      return [
        `"${influencer.name}"`,
        `"@${influencer.handle}"`,
        influencer.platform,
        influencer.followerCount,
        influencer.status,
        influencer.discountCode || '',
        salesCount,
        revenue.toFixed(2),
        commission.toFixed(2),
        influencer.email || '',
        influencer.profileUrl || '',
      ].join(',');
    });

    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `influencer-commissions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#C9A96E]">Influencer Seeding Program</h1>
          <div className="space-x-4">
            <button
              onClick={handleExportCSV}
              className="px-6 py-2 bg-[#51cf66] text-black font-semibold rounded-lg hover:bg-[#40b354] transition"
            >
              Export CSV
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-2 bg-[#C9A96E] text-black font-semibold rounded-lg hover:bg-[#a07830] transition"
            >
              Add Influencer
            </button>
            <button
              onClick={() => setShowBulkImport(true)}
              className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
            >
              Bulk Import
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <div className="bg-[#111111] p-6 rounded-lg border border-[#1d1d1f]">
              <p className="text-[#86868b] text-sm mb-2">Total</p>
              <p className="text-3xl font-bold">{stats.totalInfluencers}</p>
            </div>
            <div className="bg-[#111111] p-6 rounded-lg border border-[#1d1d1f]">
              <p className="text-[#86868b] text-sm mb-2">Contacted</p>
              <p className="text-3xl font-bold">{stats.contacted}</p>
            </div>
            <div className="bg-[#111111] p-6 rounded-lg border border-[#1d1d1f]">
              <p className="text-[#86868b] text-sm mb-2">Responded</p>
              <p className="text-3xl font-bold">{stats.responded}</p>
              <p className="text-xs text-[#86868b] mt-1">
                {stats.contacted > 0 ? ((stats.responded / stats.contacted) * 100).toFixed(0) : 0}% rate
              </p>
            </div>
            <div className="bg-[#111111] p-6 rounded-lg border border-[#1d1d1f]">
              <p className="text-[#86868b] text-sm mb-2">Agreed</p>
              <p className="text-3xl font-bold">{stats.agreed}</p>
              <p className="text-xs text-[#86868b] mt-1">
                {stats.responded > 0 ? ((stats.agreed / stats.responded) * 100).toFixed(0) : 0}% conversion
              </p>
            </div>
            <div className="bg-[#111111] p-6 rounded-lg border border-[#1d1d1f]">
              <p className="text-[#86868b] text-sm mb-2">Posted</p>
              <p className="text-3xl font-bold text-[#51cf66]">{stats.posted}</p>
              <p className="text-xs text-[#86868b] mt-1">
                {stats.agreed > 0 ? ((stats.posted / stats.agreed) * 100).toFixed(0) : 0}% fulfillment
              </p>
            </div>
            <div className="bg-[#111111] p-6 rounded-lg border border-[#1d1d1f]">
              <p className="text-[#86868b] text-sm mb-2">Revenue</p>
              <p className="text-3xl font-bold text-[#51cf66]">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-[#111111] p-6 rounded-lg border border-[#1d1d1f]">
              <p className="text-[#86868b] text-sm mb-2">Commission</p>
              <p className="text-3xl font-bold text-[#ff6b6b]">${stats.totalCommission.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-[#111111] border border-[#1d1d1f] rounded-lg text-white"
          >
            <option value="all">All Statuses</option>
            <option value="identified">Identified</option>
            <option value="contacted">Contacted</option>
            <option value="responded">Responded</option>
            <option value="agreed">Agreed</option>
            <option value="posted">Posted</option>
            <option value="declined">Declined</option>
          </select>
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="px-4 py-2 bg-[#111111] border border-[#1d1d1f] rounded-lg text-white"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>

        {/* Influencers Table */}
        <div className="bg-[#111111] rounded-lg border border-[#1d1d1f] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#1a1a1a] border-b border-[#1d1d1f]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#C9A96E]">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#C9A96E]">Handle</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#C9A96E]">Platform</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#C9A96E]">Followers</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#C9A96E]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#C9A96E]">Discount Code</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#C9A96E]">Revenue</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#C9A96E]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {influencers.map((influencer) => (
                <tr key={influencer.id} className="border-b border-[#1d1d1f] hover:bg-[#1a1a1a]">
                  <td className="px-6 py-4 text-sm">{influencer.name}</td>
                  <td className="px-6 py-4 text-sm">
                    {influencer.profileUrl ? (
                      <a href={influencer.profileUrl} target="_blank" rel="noopener noreferrer" className="text-[#C9A96E] hover:underline">
                        @{influencer.handle}
                      </a>
                    ) : (
                      `@${influencer.handle}`
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm capitalize">{influencer.platform}</td>
                  <td className="px-6 py-4 text-sm">{influencer.followerCount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <select
                      value={influencer.status}
                      onChange={(e) => handleUpdateStatus(influencer.id, e.target.value)}
                      className="px-3 py-1 bg-[#1a1a1a] border border-[#1d1d1f] rounded text-sm"
                    >
                      <option value="identified">Identified</option>
                      <option value="contacted">Contacted</option>
                      <option value="responded">Responded</option>
                      <option value="agreed">Agreed</option>
                      <option value="posted">Posted</option>
                      <option value="declined">Declined</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-[#51cf66]">{influencer.discountCode}</td>
                  <td className="px-6 py-4 text-sm">
                    ${influencer.conversions.reduce((sum, conv) => sum + conv.revenue, 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setSelectedInfluencer(influencer)}
                      className="px-3 py-1 bg-[#C9A96E] text-black text-xs font-semibold rounded hover:bg-[#a07830] transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Influencer Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-[#111111] p-8 rounded-lg border border-[#1d1d1f] max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6 text-[#C9A96E]">Add Influencer</h2>
              <form onSubmit={handleAddInfluencer} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#1d1d1f] rounded-lg text-white"
                />
                <input
                  type="text"
                  name="handle"
                  placeholder="Handle (without @)"
                  required
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#1d1d1f] rounded-lg text-white"
                />
                <select
                  name="platform"
                  required
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#1d1d1f] rounded-lg text-white"
                >
                  <option value="">Select Platform</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                </select>
                <input
                  type="number"
                  name="followerCount"
                  placeholder="Follower Count"
                  required
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#1d1d1f] rounded-lg text-white"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email (optional)"
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#1d1d1f] rounded-lg text-white"
                />
                <input
                  type="url"
                  name="profileUrl"
                  placeholder="Profile URL (optional)"
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#1d1d1f] rounded-lg text-white"
                />
                <textarea
                  name="notes"
                  placeholder="Notes (optional)"
                  rows={3}
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#1d1d1f] rounded-lg text-white"
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2 bg-[#C9A96E] text-black font-semibold rounded-lg hover:bg-[#a07830] transition"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bulk Import Modal */}
        {showBulkImport && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-[#111111] p-8 rounded-lg border border-[#1d1d1f] max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-6 text-[#C9A96E]">Bulk Import</h2>
              <p className="text-[#86868b] text-sm mb-4">
                CSV Format: name,handle,platform,followerCount,email,profileUrl
              </p>
              <form onSubmit={handleBulkImport} className="space-y-4">
                <textarea
                  name="csv"
                  placeholder="Paste CSV data here..."
                  rows={10}
                  required
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#1d1d1f] rounded-lg text-white font-mono text-sm"
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2 bg-[#C9A96E] text-black font-semibold rounded-lg hover:bg-[#a07830] transition"
                  >
                    Import
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBulkImport(false)}
                    className="flex-1 px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Influencer Detail Modal */}
        {selectedInfluencer && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-[#111111] p-8 rounded-lg border border-[#1d1d1f] max-w-3xl w-full my-8">
              <h2 className="text-2xl font-bold mb-6 text-[#C9A96E]">{selectedInfluencer.name}</h2>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-[#86868b] text-sm mb-1">Handle</p>
                  <p className="text-white">@{selectedInfluencer.handle}</p>
                </div>
                <div>
                  <p className="text-[#86868b] text-sm mb-1">Platform</p>
                  <p className="text-white capitalize">{selectedInfluencer.platform}</p>
                </div>
                <div>
                  <p className="text-[#86868b] text-sm mb-1">Followers</p>
                  <p className="text-white">{selectedInfluencer.followerCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[#86868b] text-sm mb-1">Estimated Reach</p>
                  <p className="text-white">{selectedInfluencer.estimatedReach?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[#86868b] text-sm mb-1">Discount Code</p>
                  <p className="text-[#51cf66] font-mono">{selectedInfluencer.discountCode}</p>
                </div>
                <div>
                  <p className="text-[#86868b] text-sm mb-1">Status</p>
                  <p className="text-white capitalize">{selectedInfluencer.status}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[#86868b] text-sm mb-2">Affiliate Link</p>
                <div className="bg-[#1a1a1a] p-3 rounded border border-[#1d1d1f]">
                  <p className="text-white text-sm break-all font-mono">{selectedInfluencer.affiliateLink}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[#86868b] text-sm mb-2">DM Template</p>
                <div className="bg-[#1a1a1a] p-4 rounded border border-[#1d1d1f]">
                  <p className="text-white text-sm whitespace-pre-wrap">{getDMTemplate(selectedInfluencer)}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getDMTemplate(selectedInfluencer));
                    alert("Copied to clipboard!");
                  }}
                  className="mt-2 px-4 py-2 bg-[#C9A96E] text-black text-sm font-semibold rounded hover:bg-[#a07830] transition"
                >
                  Copy Template
                </button>
              </div>

              {selectedInfluencer.notes && (
                <div className="mb-6">
                  <p className="text-[#86868b] text-sm mb-2">Notes</p>
                  <p className="text-white">{selectedInfluencer.notes}</p>
                </div>
              )}

              <div className="mb-6">
                <p className="text-[#86868b] text-sm mb-2">Conversions</p>
                {selectedInfluencer.conversions.length > 0 ? (
                  <div className="space-y-2">
                    {selectedInfluencer.conversions.map((conv, i) => (
                      <div key={i} className="bg-[#1a1a1a] p-3 rounded border border-[#1d1d1f]">
                        <p className="text-white">Revenue: ${conv.revenue.toFixed(2)} | Commission: ${conv.commission.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#86868b]">No conversions yet</p>
                )}
              </div>

              <button
                onClick={() => setSelectedInfluencer(null)}
                className="w-full px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
