"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReferralDashboard } from "@/components/ReferralDashboard";

interface Order {
  id: string;
  date: string;
  tier: string;
  status: string;
  receiptUrl: string;
}

export default function PortalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"orders" | "referrals" | "settings">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    // Fetch order history
    async function fetchOrders() {
      try {
        const response = await fetch("/api/portal/orders");
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [status, router]);

  async function openStripePortal() {
    try {
      const response = await fetch("/api/portal/billing", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Failed to open Stripe portal:", error);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-bg-card border-r border-white/[0.08] p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-text-primary">Pawcasso</h1>
          <p className="text-sm text-text-secondary mt-1">{session?.user?.email}</p>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveSection("orders")}
            className={`w-full text-left py-3 px-4 rounded-lg transition-colors ${
              activeSection === "orders"
                ? "bg-primary/10 border-l-2 border-primary text-text-primary"
                : "text-text-secondary hover:bg-white/[0.06]"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveSection("referrals")}
            className={`w-full text-left py-3 px-4 rounded-lg transition-colors ${
              activeSection === "referrals"
                ? "bg-primary/10 border-l-2 border-primary text-text-primary"
                : "text-text-secondary hover:bg-white/[0.06]"
            }`}
          >
            Referrals
          </button>
          <button
            onClick={() => setActiveSection("settings")}
            className={`w-full text-left py-3 px-4 rounded-lg transition-colors ${
              activeSection === "settings"
                ? "bg-primary/10 border-l-2 border-primary text-text-primary"
                : "text-text-secondary hover:bg-white/[0.06]"
            }`}
          >
            Settings
          </button>
        </nav>
      </aside>

      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-bg-card border-t border-white/[0.08] flex justify-around py-3 z-50">
        <button
          onClick={() => setActiveSection("orders")}
          className={`px-4 py-2 rounded-lg text-sm ${
            activeSection === "orders"
              ? "text-primary font-semibold"
              : "text-text-secondary"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveSection("referrals")}
          className={`px-4 py-2 rounded-lg text-sm ${
            activeSection === "referrals"
              ? "text-primary font-semibold"
              : "text-text-secondary"
          }`}
        >
          Referrals
        </button>
        <button
          onClick={() => setActiveSection("settings")}
          className={`px-4 py-2 rounded-lg text-sm ${
            activeSection === "settings"
              ? "text-primary font-semibold"
              : "text-text-secondary"
          }`}
        >
          Settings
        </button>
      </div>

      {/* Main Content */}
      <main className="md:ml-64 p-6 md:p-12 pb-24 md:pb-12">
        {activeSection === "orders" && (
          <div>
            <h2 className="text-3xl font-semibold text-text-primary mb-8">Order History</h2>

            {orders.length === 0 ? (
              <div className="rounded-xl border border-white/[0.08] bg-bg-card p-12 text-center">
                <p className="text-text-secondary">No orders yet</p>
              </div>
            ) : (
              <div className="rounded-xl border border-white/[0.08] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white/[0.04]">
                    <tr>
                      <th className="text-left py-4 px-6 text-xs uppercase tracking-wider font-semibold text-text-secondary">
                        Order ID
                      </th>
                      <th className="text-left py-4 px-6 text-xs uppercase tracking-wider font-semibold text-text-secondary">
                        Date
                      </th>
                      <th className="text-left py-4 px-6 text-xs uppercase tracking-wider font-semibold text-text-secondary">
                        Tier
                      </th>
                      <th className="text-left py-4 px-6 text-xs uppercase tracking-wider font-semibold text-text-secondary">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-xs uppercase tracking-wider font-semibold text-text-secondary">
                        Receipt
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr
                        key={order.id}
                        className={`hover:bg-white/[0.02] ${
                          index !== orders.length - 1 ? "border-b border-white/[0.08]" : ""
                        }`}
                      >
                        <td className="py-4 px-6 text-text-primary font-mono text-sm">
                          {order.id.slice(0, 12)}...
                        </td>
                        <td className="py-4 px-6 text-text-primary">{order.date}</td>
                        <td className="py-4 px-6 text-text-primary capitalize">{order.tier}</td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <a
                            href={order.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-light"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeSection === "referrals" && (
          <div>
            <h2 className="text-3xl font-semibold text-text-primary mb-8">Referral Program</h2>
            <ReferralDashboard />
          </div>
        )}

        {activeSection === "settings" && (
          <div>
            <h2 className="text-3xl font-semibold text-text-primary mb-8">Settings</h2>

            <div className="rounded-xl border border-white/[0.08] bg-bg-card p-8">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Billing</h3>
              <p className="text-text-secondary mb-6">
                Manage your payment methods and billing information
              </p>
              <button
                onClick={openStripePortal}
                className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors"
              >
                Manage Payment Methods
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
